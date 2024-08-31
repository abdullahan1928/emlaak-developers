"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, MenuItem, FormControl, Button } from '@mui/material';

const inquirySchema = z.object({
    inquiryType: z.string().min(1),
    role: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    propertyType: z.string().min(1),
    maxPrice: z.string(),
    minPrice: z.string(),
    description: z.string().optional(),
});

const WEB3_FORM_API_KEY = process.env.NEXT_PUBLIC_WEB3_API_KEY;

const InquiryForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof inquirySchema>>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            inquiryType: '',
            role: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            propertyType: '',
            description: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key: any) => {
                formData.append(key, data[key]);
            });

            if (WEB3_FORM_API_KEY === undefined) {
                return;
            }

            formData.append("access_key", WEB3_FORM_API_KEY);

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                setIsSubmitted(true);
            } else {
                console.error('Submission failed:', result);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="bg-[url('/images/home/form-bg.jpg')] min-h-screen flex items-center justify-center my-32">
            <div className={`max-w-xl max-4 md:mx-auto shadow-md ${isSubmitted ? 'p-6 bg-white' : 'p-12'} transition-all duration-300`}>
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h2>
                        <p className="text-lg text-gray-600 mb-6">Your inquiry has been successfully submitted. Our team will get in touch with you shortly.</p>
                        <div className="bg-green-100 p-4 rounded-md">
                            <p className="text-green-800">We appreciate your interest and look forward to assisting you.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl p-6 mx-4 bg-white shadow-md md:mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Inquiry Form</h2>
                        <div className="mb-4">
                            <FormControl fullWidth>
                                <TextField
                                    {...register('inquiryType')}
                                    defaultValue=""
                                    size='small'
                                    select
                                    label="Select"
                                >
                                    <MenuItem value="Purchase">Purchase</MenuItem>
                                    <MenuItem value="Rent">Rent</MenuItem>
                                    <MenuItem value="Sale">Sale</MenuItem>
                                </TextField>
                            </FormControl>
                            {errors.inquiryType && <p className="text-red-600">This field is required</p>}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Your Information</h3>
                        <div className="mb-4">
                            <FormControl fullWidth>
                                <TextField
                                    {...register('role')}
                                    defaultValue=""
                                    size='small'
                                    select
                                    label="I'm a"
                                >
                                    <MenuItem value="real estate agent">Real Estate Agent</MenuItem>
                                    <MenuItem value="property owner">Property Owner</MenuItem>
                                    <MenuItem value="buyer">Buyer</MenuItem>
                                </TextField>
                            </FormControl>
                            {errors.role && <p className="text-red-600">This field is required</p>}
                        </div>
                        <div className="flex flex-row gap-2 mb-4">
                            <TextField
                                label="First Name"
                                size='small'
                                {...register('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName ? 'This field is required' : ''}
                                className='w-1/2'
                            />
                            <TextField
                                label="Last Name"
                                size='small'
                                {...register('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName ? 'This field is required' : ''}
                                className='w-1/2'
                            />
                        </div>
                        <div className="flex flex-row gap-2 mb-4">
                            <TextField
                                label="Email Address"
                                size='small'
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email ? 'Invalid email address' : ''}
                                className='w-1/2'
                            />
                            <TextField
                                label="Phone No."
                                size='small'
                                {...register('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone ? 'This field is required' : ''}
                                className='w-1/2'
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Property Details</h3>
                        <div className="mb-4">
                            <FormControl fullWidth>
                                <TextField
                                    {...register('propertyType')}
                                    defaultValue=""
                                    size='small'
                                    label="Select Type"
                                    select
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                },
                                            },
                                            anchorOrigin: {
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            },
                                            transformOrigin: {
                                                vertical: 'top',
                                                horizontal: 'left',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Office">Office</MenuItem>
                                    <MenuItem value="Shop">Shop</MenuItem>
                                    <MenuItem value="Warehouse">Warehouse</MenuItem>
                                    <MenuItem value="Factory">Factory</MenuItem>
                                    <MenuItem value="Farmhouse">Farmhouse</MenuItem>
                                    <MenuItem value="Plots">Plots</MenuItem>
                                    <MenuItem value="Agricultural Land">Agricultural Land</MenuItem>
                                    <MenuItem value="Industrial Land">Industrial Land</MenuItem>
                                    <MenuItem value="Commercial Plot">Commercial Plot</MenuItem>
                                    <MenuItem value="Residential Plot">Residential Plot</MenuItem>
                                    <MenuItem value="Penthouse">Penthouse</MenuItem>
                                    <MenuItem value="House">House</MenuItem>
                                    <MenuItem value="Flat">Flat</MenuItem>
                                    <MenuItem value="Building">Building</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </FormControl>
                            {errors.propertyType && <p className="text-red-600">This field is required</p>}
                        </div>
                        <div className="flex flex-row gap-2 mb-4">
                            <TextField
                                label="Max Price"
                                size='small'
                                type="number"
                                {...register('maxPrice')}
                                error={!!errors.maxPrice}
                                helperText={errors.maxPrice ? 'This field is required' : ''}
                                className='w-1/2'
                            />
                            <TextField
                                label="Min Price"
                                size='small'
                                type="number"
                                {...register('minPrice')}
                                error={!!errors.minPrice}
                                helperText={errors.minPrice ? 'This field is required' : ''}
                                className='w-1/2'
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                {...register('description')}
                            />
                        </div>
                        <Button
                            type="submit"
                            className='w-full !text-lg !text-white !border !border-white !bg-black hover:!bg-primary hover:!border-primary !rounded-none'
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default InquiryForm;
