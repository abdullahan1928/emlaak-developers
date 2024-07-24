import AdminDashboardLayout from "@/components/layouts/admin/AdminDashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel - Emlaak Developers",
    description: "Emlaak Developers - Admin Panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminDashboardLayout>
                {children}
            </AdminDashboardLayout>
        </>
    );
}
