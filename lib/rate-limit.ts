import { get, put } from "@vercel/blob";
import { useBlobStorage } from "./config";
import { hashKey } from "./hash";

type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

async function readBucket(key: string): Promise<Bucket | null> {
  if (!useBlobStorage()) {
    return memory.get(key) ?? null;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const pathname = `takidesk-online/ratelimit/${key}.json`;
  try {
    const result = await get(pathname, { access: "private", token, useCache: false });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as Bucket;
  } catch {
    return null;
  }
}

async function writeBucket(key: string, bucket: Bucket): Promise<void> {
  if (!useBlobStorage()) {
    memory.set(key, bucket);
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const pathname = `takidesk-online/ratelimit/${key}.json`;
  await put(pathname, JSON.stringify(bucket), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}

export async function enforceRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const id = await hashKey(input.key);
  const now = Date.now();
  let bucket = await readBucket(id);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + input.windowMs };
  }

  if (bucket.count >= input.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  await writeBucket(id, bucket);
  return { ok: true };
}
