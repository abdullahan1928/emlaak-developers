import { EmailTemplate } from '../../../components/templates/inquiry';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);

export async function POST(req: NextRequest) {
    const { email, firstName, inquiryType, lastName, maxPrice, minPrice, number, propertyType, role } = await req.json();

    try {
        const { data, error } = await resend.emails.send({
            from: 'abdullahan1928@gmail.com',
            to: email,
            subject: 'Hello world',
            react: EmailTemplate({ firstName: 'John' }),
            text: 'Hello world', // Add a text property
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
