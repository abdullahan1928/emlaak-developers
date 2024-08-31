import { EmailTemplate } from '../../../components/templates/inquiry';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(req: NextRequest) {
    const { email, firstName, inquiryType, lastName, maxPrice, minPrice, phone, propertyType, role, description } = await req.json();


    console.log(resend)

    try {
        console.log(email, firstName, inquiryType, lastName, maxPrice, minPrice, phone, propertyType, role, description);
        const { data, error } = await resend.emails.send({
            from: 'abdullahan1928@gmail.com',
            to: [email],
            subject: 'Hello world',
            react: EmailTemplate({
                inquiryType,
                role,
                firstName,
                lastName,
                email,
                phone,
                propertyType,
                maxPrice,
                minPrice,
                description,
            }),
        });

        if (error) {
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
