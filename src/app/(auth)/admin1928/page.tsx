"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";
import { ROUTES } from "@/routes";

const AdminLoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!email || !validateEmail(email)) {
            setErrorMsg("Please enter a valid email");
            return;
        }

        if (!password) {
            setErrorMsg("Please enter your password");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/auth/login", { email, password });
            router.push(ROUTES.ADMIN.DASHBOARD);
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left branding/illustration */}
            <div className="hidden md:flex flex-1 bg-primary relative items-center justify-center overflow-hidden">
                <div className="relative text-white text-center px-12 z-10">
                    <h1 className="text-5xl font-extrabold mb-4">Admin Portal</h1>
                    <p className="text-lg">
                        Manage properties, projects, and users with ease and security
                    </p>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center bg-secondary">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md p-12 bg-white rounded-3xl shadow-2xl space-y-8"
                >
                    <div className="flex justify-center mb-6">
                        <Link href={ROUTES.PUBLIC.HOME}>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Admin Sign In
                    </h2>

                    {errorMsg && (
                        <div className="text-red-600 text-sm text-center font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {/* Email input */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pr-10"
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Password input */}
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-white py-5 font-semibold hover:bg-secondary transition-all"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                        <Link href={ROUTES.PUBLIC.HOME}>
                            <span className="underline hover:text-gray-900">Back to Home</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;