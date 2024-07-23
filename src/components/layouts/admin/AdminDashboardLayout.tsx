"use client";
import { Box } from "@mui/material";
import { useState } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import LoadingOverlay from "./Sidebar/LoadingOverlay";
import { useRouter } from "next/navigation";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlelogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/')
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      {loading && <LoadingOverlay />}
      <Nav open={open} setopen={setopen} handlelogout={handlelogout} />
      <Sidebar open={open} handlelogout={handlelogout} >
        {children}
      </Sidebar>
    </Box>
  );
};

export default AdminDashboardLayout;
