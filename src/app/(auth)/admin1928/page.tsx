"use client";
import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import { Search, Visibility, VisibilityOff, ErrorOutline, Key } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Validate email field
        if (!email) {
            setEmailError(true);
            return;
        } else {
            setEmailError(false);
        }

        try {
            await axios.post('/api/auth/login', { email, password });
            router.push('/admin/dashboard');
        } catch (error) {
            setCredentialsError(true);
        }

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">

            <form onSubmit={handleSubmit} className="flex flex-col w-1/2 max-w-lg px-8 pt-8 pb-24 bg-white rounded-lg">

                <Link href="/" className="mx-auto mb-4">
                    <Image
                        src="/logo.png"
                        alt="Emlaak Logo"
                        width={1000}
                        height={1000}
                        priority
                        className='object-contain w-24 h-24 transition-all duration-300 ease-in-out cursor-pointer'
                    />
                </Link>

                <div className="flex flex-col gap-8 my-8">
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        className={`mb-4 ${emailError ? 'border-red-500' : ''}`}
                        size='small'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (!validateEmail(e.target.value)) {
                                setEmailError(true);
                            } else {
                                setEmailError(false);
                            }
                        }}
                        required
                        InputProps={{
                            startAdornment: <Search sx={{ marginRight: '8px' }} />,
                        }}
                        onBlur={() => {
                            if (!email || !validateEmail(email)) {
                                setEmailError(true);
                            } else {
                                setEmailError(false);
                            }
                        }}
                        error={emailError}
                        helperText={emailError && <Typography variant="body2" color="error"><ErrorOutline /> Please enter a valid email</Typography>}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        size='small'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: <Key sx={{ marginRight: '8px' }} />,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ?
                                            <VisibilityOff />
                                            : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {credentialsError &&
                    <Typography variant="body1" color="error" className="!mb-8 flex items-center gap-2"><ErrorOutline /> Invalid email or password</Typography>
                }

                <Button
                    type="submit"
                    variant="contained"
                    className="!text-white !border !border-white !bg-black hover:!bg-white hover:!text-black"
                >
                    Sign In
                </Button>
            </form>
        </div>
    );
};

export default SignupForm;
