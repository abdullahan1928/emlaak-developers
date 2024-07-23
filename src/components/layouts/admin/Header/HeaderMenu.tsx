import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const HeaderMenu = (handlelogout: { handlelogout: () => Promise<void> }) => {
    const name = "Admin";
    const [anchorEl, setAnchorEl] = useState(null);

    const router = useRouter();

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { label: 'Dashboard', action: () => router.push('/admin/dashboard') },
        { label: 'Properties', action: () => router.push('/admin/properties') },
        { label: 'Projects', action: () => router.push('/admin/projects') },
    ];

    return (
        <>
            <div
                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200"
                onClick={handleMenuOpen}
            >
                <div className={`flex items-center justify-center w-10 h-10 mr-2 text-xl bg-gray-800 rounded-full`}>
                    {name[0]}
                </div>

                <Typography
                    variant="subtitle1"
                    noWrap
                    component="div"
                    sx={{
                        color: "black",
                    }}
                >
                    {name}
                </Typography>
                <ArrowDropDownIcon sx={{ color: "black" }} />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    "& .MuiMenu-paper": {
                        width: "20rem",
                        border: ".1rem solid #dbe0eb",
                        marginTop: "0.5rem",
                    },
                }}
            >
                <div className="flex items-center px-4 py-2 cursor-auto">
                    <div className="flex items-center justify-center w-10 h-10 mr-2 text-white bg-gray-800 rounded-full cursor-auto">
                        {name[0]}
                    </div>
                    <div className="flex flex-col cursor-auto">
                        <Typography variant="subtitle1" noWrap component="div" sx={{ color: "black" }}>
                            {name}
                        </Typography>
                    </div>
                </div>

                <Divider />

                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            handleMenuClose();
                            item.action();
                        }}
                        sx={{
                            padding: "0.7rem",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}

                <Divider />

                <MenuItem
                    onClick={() => handlelogout.handlelogout()}
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    Logout
                </MenuItem>

            </Menu>
        </>
    )
}

export default HeaderMenu