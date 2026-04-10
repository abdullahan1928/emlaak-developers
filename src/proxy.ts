import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ROUTES } from "./routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  let isValid = false;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isValid) {
      return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, request.url));
    }
  }

  // Prevent logged-in users from accessing public auth pages
  if (pathname.startsWith("/public") && isValid) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/public/:path*"],
};