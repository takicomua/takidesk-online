function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashEmail(email: string) {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

export async function hashKey(value: string) {
  const data = new TextEncoder().encode(value);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}
