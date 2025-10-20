import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { pathname, origin } = request.nextUrl;

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

  const sessionId = request.cookies.get("__Host-session")?.value;
  const loginUrl = new URL("/auth/login", request.url);

  if (!sessionId) {
    return NextResponse.redirect(loginUrl);
  }

  const sessionCheckUrl = new URL("/api/auth/check-session", origin);

  const sessionCheck = await fetch(sessionCheckUrl, {
    headers: {
      'Cookie': request.headers.get('Cookie') || '',
    },
    cache: 'no-store',
  });

  if (!sessionCheck.ok) {
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete('__Host-session');
    return redirectResponse;
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