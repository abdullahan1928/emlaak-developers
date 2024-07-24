// src/middleware.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const authToken = request.cookies.get("token");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/public") && authToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/public/:path*"],
};
