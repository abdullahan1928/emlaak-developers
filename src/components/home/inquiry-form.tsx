"use client";
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { TextField, MenuItem, FormControl, Button } from '@mui/material'

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
})

const InquiryForm = () => {
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
    })

    const onSubmit = async (e: any) => {
        // e.preventDefault();

        console.log(e)

        const response = await fetch('/api/inquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(e),
        });

        console.log(response);
    };

    return (
        <div className="bg-[url('/images/home/form-bg.jpg')] w-full my-32">
            <div className="py-12">
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl p-6 mx-4 bg-white rounded-md shadow-md md:mx-auto">
                    <h2 className="mb-2 font-bold">Inquiry Form</h2>
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
                    <h3 className="mb-2 font-bold">Your Information</h3>
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
                    <h3 className="mb-2 font-bold">Property Details</h3>
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
                        // type="submit"
                        // color='secondary'
                        className='w-full !text-lg !text-white !border !border-white !bg-black hover:!bg-white hover:!text-black'
                        variant="contained"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default InquiryForm
