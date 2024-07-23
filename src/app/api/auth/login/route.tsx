// app/api/login/route.js
import dbConnect from '@/lib/connectDB';
import Admin from '@/models/admin.model';
import { signToken } from '@/utils/jwt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    await dbConnect();

    const { email, password } = await req.json();

    try {
        const admin = await Admin.findOne({ email, password });

        if (!admin) {
            return new Response(JSON.stringify(
                { message: 'Invalid credentials' }),
                { status: 401 }
            );
        }

        const token = signToken({ id: admin._id, email: admin.email });
        const tokenExpiry = new Date(Date.now() + 2592000000);
        const cookie = `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000; Expires=${tokenExpiry.toUTCString()}`;
        return new Response(JSON.stringify({ message: 'Logged in successfully' }), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
