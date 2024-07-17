// pages/api/signup.js
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Admin from '@/models/admin.model';

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const email = req.nextUrl.searchParams.get('email');
        const password = req.nextUrl.searchParams.get('password');

        console.log('Email:', email);
        console.log('Password:', password);

        // Check if admin exists with the provided email and password
        const admin = await Admin.findOne({ email, password });

        console.log('Admin:', admin);

        if (!admin) {
            return NextResponse.json({ message: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Admin found" }, { status: 200 });

    } catch (error) {
        console.error('Error fetching admin:', error);
        return NextResponse.json({ message: "Error fetching admin" }, { status: 500 });
    }
}
