// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('token'); // Make sure the path matches where the cookie was set
    return response;
}
