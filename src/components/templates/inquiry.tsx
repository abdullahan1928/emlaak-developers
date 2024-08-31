import * as React from 'react';

interface EmailTemplateProps {
    inquiryType: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    propertyType: string;
    maxPrice: string;
    minPrice: string;
    description: string;
}

export const EmailTemplate = ({
    inquiryType,
    role,
    firstName,
    lastName,
    email,
    phone,
    propertyType,
    maxPrice,
    minPrice,
    description
}: EmailTemplateProps) => (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1 style={{ color: '#4CAF50' }}>Hello {firstName} {lastName},</h1>

        <p>Thank you for reaching out to us with your <strong>{inquiryType}</strong> inquiry.</p>

        <p>We are excited to assist you in finding the perfect <strong>{propertyType}</strong> that meets your requirements.</p>

        <h2 style={{ color: '#4CAF50' }}>Inquiry Details</h2>
        <ul>
            <li><strong>Role:</strong> {role}</li>
            <li><strong>Email:</strong> {email}</li>
            <li><strong>Phone Number:</strong> {phone}</li>
            <li><strong>Property Type:</strong> {propertyType}</li>
            <li><strong>Price Range:</strong> ${minPrice} - ${maxPrice}</li>
        </ul>

        <h2 style={{ color: '#4CAF50' }}>Description</h2>
        <p>{description}</p>

        <p>If you have any further details to provide or specific preferences, feel free to respond to this email, and we’ll be happy to assist you.</p>

        <p>We look forward to helping you with your property needs!</p>

        <p>Best regards,</p>
        <p><strong>The Real Estate Team</strong></p>
    </div>
);
