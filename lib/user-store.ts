import { put, list, get, head } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { UserRecord } from "./types";
import { requireBlobToken, useBlobStorage } from "./config";
import { hashEmail } from "./hash";

const LOCAL_DIR = path.join(process.cwd(), "data", "users");

async function userBlobPath(email: string) {
  return `takidesk-online/users/${await hashEmail(email)}.json`;
}

async function localUserPath(email: string) {
  return path.join(LOCAL_DIR, `${await hashEmail(email)}.json`);
}

async function readLocalUser(email: string): Promise<UserRecord | null> {
  try {
    const raw = await fs.readFile(await localUserPath(email), "utf8");
    return JSON.parse(raw) as UserRecord;
  } catch {
    return null;
  }
}

async function writeLocalUser(user: UserRecord): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const file = await localUserPath(user.email);
  try {
    await fs.writeFile(file, JSON.stringify(user, null, 2), {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
    if (code === "EEXIST") throw new Error("EMAIL_TAKEN");
    throw err;
  }
}

async function readBlobUser(email: string): Promise<UserRecord | null> {
  const token = requireBlobToken();
  const pathname = await userBlobPath(email);

  try {
    await head(pathname, { token });
  } catch {
    return null;
  }

  const result = await get(pathname, { access: "private", token, useCache: false });
  if (!result?.stream) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as UserRecord;
}

async function writeBlobUser(user: UserRecord): Promise<void> {
  const token = requireBlobToken();
  const pathname = await userBlobPath(user.email);

  try {
    await head(pathname, { token });
    throw new Error("EMAIL_TAKEN");
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") throw err;
  }

  try {
    await put(pathname, JSON.stringify(user, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
      token,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already exists|overwrite|precondition|conflict/i.test(message)) {
      throw new Error("EMAIL_TAKEN");
    }
    throw err;
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const user = useBlobStorage()
    ? await readBlobUser(normalized)
    : await readLocalUser(normalized);
  return user ?? undefined;
}

export async function createUser(
  user: Omit<UserRecord, "id" | "createdAt"> & { id?: string },
): Promise<UserRecord> {
  const email = user.email.trim().toLowerCase();
  const record: UserRecord = {
    id: user.id ?? crypto.randomUUID(),
    name: user.name.trim(),
    email,
    passwordHash: user.passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (!useBlobStorage()) {
    if (process.env.VERCEL === "1") {
      throw new Error("STORAGE_UNAVAILABLE");
    }
    await writeLocalUser(record);
    return record;
  }

  await writeBlobUser(record);
  return record;
}

export async function blobStoreHealthy(): Promise<boolean> {
  if (!useBlobStorage()) return process.env.VERCEL !== "1";
  try {
    const token = requireBlobToken();
    await list({ prefix: "takidesk-online/", limit: 1, token });
    return true;
  } catch {
    return false;
  }
}
