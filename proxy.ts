import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = [
  "/dashboard",
  "/backlog",
  "/discover",
  "/recommendations",
  "/tonight",
  "/stats",
  "/settings",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = pathname === "/login";

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    const callbackUrl = `${pathname}${search}`;

    if (callbackUrl !== "/dashboard") {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/backlog/:path*",
    "/discover/:path*",
    "/recommendations/:path*",
    "/tonight/:path*",
    "/stats/:path*",
    "/settings/:path*",
    "/login",
  ],
};
