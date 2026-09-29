export const SESSION_COOKIE = "takidesk_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const BCRYPT_ROUNDS = 12;

export function isProductionRuntime() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export function requireAuthSecret(): Uint8Array {
  const secret = (process.env.AUTH_SECRET ?? "").trim().replace(/^["']|["']$/g, "");

  if (isProductionRuntime()) {
    if (!secret || secret.length < 32) {
      throw new Error(
        "AUTH_SECRET must be set to a random string of at least 32 characters in production.",
      );
    }
    if (secret.includes("replace-with") || secret.includes("change-me")) {
      throw new Error("AUTH_SECRET uses a placeholder value. Generate a real secret.");
    }
  }

  if (!secret || secret.length < 16) {
    if (isProductionRuntime()) {
      throw new Error("AUTH_SECRET is required.");
    }
    return new TextEncoder().encode("takidesk-online-dev-secret-change-me");
  }

  return new TextEncoder().encode(secret);
}

export function requireBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (isProductionRuntime() && !token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is required in production. Create a Vercel Blob store and link it.",
    );
  }
  return token ?? "";
}

export function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}
