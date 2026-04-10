import AdminDashboardLayout from "@/components/layouts/admin/AdminDashboardLayout";
import { SITE_NAME } from "@/data/social.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Admin Panel | ${SITE_NAME}`,
    description: `${SITE_NAME} - Admin Panel`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AdminDashboardLayout>
            {children}
        </AdminDashboardLayout>
    );
}
