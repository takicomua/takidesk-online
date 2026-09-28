import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "./user-store";
import type { PublicUser } from "./types";
import { loginSchema, registerSchema } from "./types";
import {
  BCRYPT_ROUNDS,
  FLASH_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  requireAuthSecret,
} from "./config";
import { enforceRateLimit } from "./rate-limit";

// Real bcrypt hash for "timing-dummy" (cost 12) — equalizes login timing.
const TIMING_HASH =
  "$2b$12$hGWjX1PoR8kbisf4rmgEa.MrQIhcRge9GO/REK83254mpxZ9SJ7jm";

function toPublic(user: {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function clientKey(suffix: string) {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return `${suffix}:${ip}`;
}

export async function setFlash(message: string) {
  const jar = await cookies();
  jar.set(FLASH_COOKIE, message, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60,
  });
}

export async function consumeFlash(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(FLASH_COOKIE)?.value ?? null;
  if (value) {
    jar.set(FLASH_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }
  return value;
}

export async function createSession(user: PublicUser) {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(requireAuthSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, requireAuthSecret());
    const id = String(payload.sub ?? "");
    const email = String(payload.email ?? "");
    const name = String(payload.name ?? "");
    if (!id || !email) return null;

    // Re-validate against store so deleted users lose access.
    const fresh = await findUserByEmail(email);
    if (!fresh || fresh.id !== id) return null;

    return toPublic(fresh);
  } catch {
    return null;
  }
}

export async function registerUser(input: unknown) {
  const limit = await enforceRateLimit({
    key: await clientKey("register"),
    limit: 8,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      ok: false as const,
      error: `Забагато спроб. Спробуй через ${limit.retryAfterSec} с.`,
    };
  }

  const parsed = registerSchema.safeParse({
    name: typeof input === "object" && input && "name" in input ? String((input as { name: unknown }).name ?? "") : "",
    email:
      typeof input === "object" && input && "email" in input
        ? String((input as { email: unknown }).email ?? "")
        : "",
    password:
      typeof input === "object" && input && "password" in input
        ? String((input as { password: unknown }).password ?? "")
        : "",
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return {
        ok: false as const,
        error: "Не вдалося створити акаунт з цими даними. Увійди або спробуй інший email.",
      };
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await createUser({ name, email, passwordHash });
    const publicUser = toPublic(user);
    await createSession(publicUser);
    return { ok: true as const, user: publicUser };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "EMAIL_TAKEN") {
      return {
        ok: false as const,
        error: "Не вдалося створити акаунт з цими даними. Увійди або спробуй інший email.",
      };
    }
    if (message === "STORAGE_UNAVAILABLE" || /BLOB_READ_WRITE_TOKEN|AUTH_SECRET/i.test(message)) {
      return {
        ok: false as const,
        error: "Сервіс тимчасово недоступний. Спробуй пізніше.",
      };
    }
    console.error("registerUser", err);
    return { ok: false as const, error: "Не вдалося створити акаунт. Спробуй ще раз." };
  }
}

export async function loginUser(input: unknown) {
  const limit = await enforceRateLimit({
    key: await clientKey("login"),
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      ok: false as const,
      error: `Забагато спроб. Спробуй через ${limit.retryAfterSec} с.`,
    };
  }

  const parsed = loginSchema.safeParse({
    email:
      typeof input === "object" && input && "email" in input
        ? String((input as { email: unknown }).email ?? "")
        : "",
    password:
      typeof input === "object" && input && "password" in input
        ? String((input as { password: unknown }).password ?? "")
        : "",
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }

  const user = await findUserByEmail(parsed.data.email);
  const hash = user?.passwordHash || TIMING_HASH;
  const valid = await bcrypt.compare(parsed.data.password, hash);

  if (!user || !valid) {
    return { ok: false as const, error: "Невірний email або пароль" };
  }

  const publicUser = toPublic(user);
  await createSession(publicUser);
  return { ok: true as const, user: publicUser };
}
