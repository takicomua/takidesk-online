import { put, list, get } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { UserRecord, UsersFile } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "users.json");
const BLOB_PATHNAME = "takidesk-online/users.json";

function emptyStore(): UsersFile {
  return { users: [] };
}

async function readLocal(): Promise<UsersFile> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as UsersFile;
  } catch {
    return emptyStore();
  }
}

async function writeLocal(data: UsersFile): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<UsersFile> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return emptyStore();

  const listed = await list({ prefix: BLOB_PATHNAME, limit: 5, token });
  const exists = listed.blobs.some((b) => b.pathname === BLOB_PATHNAME);
  if (!exists) return emptyStore();

  const result = await get(BLOB_PATHNAME, { access: "private", token, useCache: false });
  if (!result?.stream) {
    return emptyStore();
  }

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as UsersFile;
}

async function writeBlob(data: UsersFile): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getUsers(): Promise<UserRecord[]> {
  const store = useBlob() ? await readBlob() : await readLocal();
  return store.users;
}

export async function saveUsers(users: UserRecord[]): Promise<void> {
  const payload: UsersFile = { users };
  if (useBlob()) {
    await writeBlob(payload);
  } else {
    await writeLocal(payload);
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = await getUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email === normalized);
}

export async function createUser(
  user: Omit<UserRecord, "id" | "createdAt"> & { id?: string },
): Promise<UserRecord> {
  const users = await getUsers();
  const email = user.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const record: UserRecord = {
    id: user.id ?? crypto.randomUUID(),
    name: user.name.trim(),
    email,
    passwordHash: user.passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(record);
  await saveUsers(users);
  return record;
}
