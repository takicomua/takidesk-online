import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/config";

function getSecret() {
  const secret = (process.env.AUTH_SECRET ?? "").trim().replace(/^["']|["']$/g, "");
  if (secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return null;
  }
  return new TextEncoder().encode("takidesk-online-dev-secret-change-me");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Never cache authenticated or auth HTML.
  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
  }

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const secret = getSecret();
    if (!token || !secret) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, secret);
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      const redirect = NextResponse.redirect(url);
      redirect.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
