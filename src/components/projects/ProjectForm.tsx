import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, MenuItem, FormControl, Button } from '@mui/material';

const projectFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    interest: z.string().min(1, 'Interest is required'),
});

type FormValues = z.infer<typeof projectFormSchema>;

const ProjectForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            interest: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        // Handle form submission
        console.log(data);
    };

    return (
        <div className="py-24 text-center">
            <h2 className="text-4xl text-gray-800 uppercase">
                Free advice from Emlaak Developers
                </h2>
            <p className="mt-4 mb-8 text-lg text-gray-600">
                To hear from our experienced team members fill out the form below to get in touch with us instantly.
            </p>


            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl px-6 py-12 mx-4 shadow-md bg-gray-50 md:mx-auto">
                <h2 className="mb-8 text-2xl font-bold text-center">
                    FILL FOR FREE QUOTE
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="mb-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    error={!!errors.name}
                                    helperText={errors.name ? errors.name.message : ''}
                                    required
                                    fullWidth
                                    sx={{ backgroundColor: 'white' }}
                                />
                            )}
                        />
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone No."
                                    error={!!errors.phone}
                                    helperText={errors.phone ? errors.phone.message : ''}
                                    required
                                    fullWidth
                                    sx={{ backgroundColor: 'white' }}
                                />
                            )}
                        />
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email Address"
                                    error={!!errors.email}
                                    helperText={errors.email ? errors.email.message : ''}
                                    required
                                    fullWidth
                                    sx={{ backgroundColor: 'white' }}
                                />
                            )}
                        />
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="interest"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                        {...field}
                                        label="I'm interested in..."
                                        select
                                        error={!!errors.interest}
                                        helperText={errors.interest ? errors.interest.message : ''}
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        <MenuItem value="Information about the Project">Information about the Project</MenuItem>
                                        <MenuItem value="A property consultant to contact me">A property consultant to contact me</MenuItem>
                                    </TextField>
                                </FormControl>
                            )}
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className='w-full !text-lg !text-white !border !border-white !bg-black hover:!bg-primary hover:!text-black !rounded-none !mt-4'
                    variant="contained"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default ProjectForm;
