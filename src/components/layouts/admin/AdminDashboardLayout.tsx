"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  BarChart3,
  Settings,
  LogOut,
  GitBranch,
  ChevronsUpDown,
} from "lucide-react";
import { SITE_NAME } from "@/data/social.data";
import Link from "next/link";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: ROUTES.ADMIN.DASHBOARD },
    { icon: GitBranch, label: "Properties", href: ROUTES.ADMIN.PROPERTIES.LIST },
    { icon: BarChart3, label: "Projects", href: ROUTES.ADMIN.PROJECTS.LIST },
  ];

  return (
    <SidebarProvider>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl border bg-white px-6 py-4 shadow-lg">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
            <span className="text-sm font-medium text-gray-700">Logging out...</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar collapsible="icon" variant="sidebar" className="border-r bg-linear-to-b from-white/80 via-white/70 to-white/90 shadow-lg">
        <SidebarHeader>
          <div
            className="flex items-center justify-center py-6 cursor-pointer"
            onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={110}
              height={110}
              className="object-contain"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navItems.map((item, i) => {
                  const isActive =
                    item.href === ROUTES.PUBLIC.HOME
                      ? pathname === ROUTES.PUBLIC.HOME
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 bg-transparent! hover:bg-primary/30! hover:text-secondary!",
                          isActive && "bg-primary!"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto mb-4">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 bg-transparent! hover:bg-primary/30! hover:text-secondary",
                      pathname === ROUTES.ADMIN.SETTINGS && "bg-primary!"
                    )}
                  >
                    <Link href={ROUTES.ADMIN.SETTINGS} className="flex items-center gap-2 w-full">
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 bg-transparent! text-red-600! hover:bg-red-50! hover:text-red-700! transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

      </Sidebar>

      {/* Main */}
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-6 border-b bg-white shadow-sm">
          <div className="items-center flex gap-4">
            <SidebarTrigger />

            {SITE_NAME}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronsUpDown size={16} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 space-y-2">
              <div className="px-3 py-2 text-sm text-gray-500">Admin Account</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN.PROPERTIES.LIST)}>Properties</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN.PROJECTS.LIST)}>Projects</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}