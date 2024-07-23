// src/middleware.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  // const path = url.pathname;
  // const ip = request.headers.get("x-forwarded-for") || "unknown";
  // const userAgent = request.headers.get("user-agent") || "unknown";

  // console.log(request.nextUrl);

  // Log visit by making a POST request to the /api/track-visit endpoint
  // try {
  //   axios.post("/api/analytics/visits", { path, ip, userAgent });
  // } catch (error: any) {
  //   console.error("Failed to log visit:", error.message);
  // }

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
