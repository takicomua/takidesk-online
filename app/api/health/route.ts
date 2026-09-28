import { NextResponse } from "next/server";
import { isProductionRuntime } from "@/lib/config";
import { blobStoreHealthy } from "@/lib/user-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawSecret = (process.env.AUTH_SECRET ?? "").trim().replace(/^["']|["']$/g, "");
  const authSecret = rawSecret.length >= 32 && !rawSecret.includes("replace-with");
  const blob = await blobStoreHealthy();
  const ready = isProductionRuntime() ? authSecret && blob : true;

  return NextResponse.json(
    {
      ok: ready,
      service: "takidesk-online",
      checks: {
        authSecret,
        blobStorage: blob,
        runtime: isProductionRuntime() ? "production" : "development",
      },
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
