import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/auth/check-session") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/public/")
  ) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cookieName =
    process.env.NODE_ENV === "production" && process.env.HTTPS === "true"
      ? "__Host-session"
      : "session";
  const sessionId = request.cookies.get(cookieName)?.value;

  console.log("sessionId:", sessionId);
  console.log("cookies:", request.cookies.getAll());

  const loginUrl = new URL("/auth/login", request.url);

  if (!sessionId) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const baseUrl = process.env.APP_URL
      ? process.env.APP_URL.replace(/\/$/, "")
      : new URL(request.url).origin;

    console.log("baseUrl:", baseUrl);

    const sessionCheckUrl = new URL(`${baseUrl}/api/auth/check-session`);
    const sessionCheck = await fetch(sessionCheckUrl, {
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
      cache: "no-store",
    });

    console.log("sessionCheck:", sessionCheck);

    if (!sessionCheck.ok) {
      console.log("session is not ok");
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete(cookieName);
      return redirectResponse;
    }
  } catch (error) {
    console.error("Session check error:", error);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|sw.js|app-icons).*)",
  ],
};
