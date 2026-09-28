import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "./user-store";
import type { PublicUser } from "./types";
import { loginSchema, registerSchema } from "./types";

const COOKIE_NAME = "takidesk_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) {
    return new TextEncoder().encode(secret);
  }
  // Local/dev fallback so the project runs out of the box.
  // On Vercel set AUTH_SECRET in project env.
  return new TextEncoder().encode("takidesk-online-dev-secret-change-me");
}

function toPublic(user: { id: string; name: string; email: string; createdAt: string }): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function createSession(user: PublicUser) {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = String(payload.sub ?? "");
    const name = String(payload.name ?? "");
    const email = String(payload.email ?? "");
    if (!id || !email) return null;
    return {
      id,
      name,
      email,
      createdAt: "",
    };
  } catch {
    return null;
  }
}

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }

  const { name, email, password } = parsed.data;
  const existing = await findUserByEmail(email);
  if (existing) {
    return { ok: false as const, error: "Цей email уже зареєстровано" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash });
  const publicUser = toPublic(user);
  await createSession(publicUser);
  return { ok: true as const, user: publicUser };
}

export async function loginUser(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    return { ok: false as const, error: "Невірний email або пароль" };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Невірний email або пароль" };
  }

  const publicUser = toPublic(user);
  await createSession(publicUser);
  return { ok: true as const, user: publicUser };
}
