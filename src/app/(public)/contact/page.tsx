"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, IconButton } from '@mui/material';
import { LocationOn, Phone } from '@mui/icons-material';
import { socialLinks, emailLink, phoneNumber, location, contact } from '@/data/social.data';

// Define the schema with Zod
const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
});

// Define the form types
type FormData = z.infer<typeof schema>;

const ContactPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        // Handle form submission
        console.log(data);
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Free Quote from Emlaak Marketing</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Our professional team is serving many housing societies for marketing purposes and has completed many renowned projects achieving high excellency.
                </p>

                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <div className="lg:w-1/3 lg:border-l-8 p-4 lg:border-primary lg:pl-8 bg-gray-100">
                        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2> */}
                        {contact.map((contactInfo, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">{contactInfo.name}</h3>
                                <div className="mb-4">
                                    <div className="flex items-center mb-4">
                                        <LocationOn className="mr-3 text-secondary-600" />
                                        <p className="text-gray-700">{contactInfo.location}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        {contactInfo.phone.map((phone, idx) => (
                                            <div key={idx} className="flex items-center mb-4">
                                                <Phone className="mr-3 text-secondary-600" />
                                                <a href={`tel:${phone}`} className="text-gray-700 hover:underline">{phone}</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border-gray-200" />
                            </div>
                        ))}
                        <div className="flex space-x-4 mt-4">
                            {socialLinks.map(({ name, href, icon: Icon }) => (
                                <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="transition transform hover:scale-110">
                                    <IconButton color="primary">
                                        <Icon />
                                    </IconButton>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-2/3 mt-8 lg:mt-0">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="p-6"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div>
                                    <TextField
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        {...register('name')}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        {...register('phone')}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        fullWidth
                                        {...register('email')}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Subject"
                                        variant="outlined"
                                        fullWidth
                                        {...register('subject')}
                                        error={!!errors.subject}
                                        helperText={errors.subject?.message}
                                    />
                                </div>
                            </div>
                            <div className="mb-8">
                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    {...register('message')}
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-4 !bg-black hover:!bg-primary hover:text-black transition duration-300 !rounded-none !py-3"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;