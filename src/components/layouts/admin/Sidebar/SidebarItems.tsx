import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountTree from "@mui/icons-material/AccountTree";
import { Divider, List, Box } from "@mui/material";
import { Fragment, useState } from "react";
import SidebarItem from "./SidebarItem";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

interface SidebarItemsProps {
    open: boolean;
    handlelogout: () => Promise<void>;
}

const SidebarItems = ({ open, handlelogout }: SidebarItemsProps) => {

    const sidebarItems = [
        [
            {
                icon: <HomeIcon />,
                text: "Home",
                to: "/admin/dashboard"
            },
            {
                icon: <AccountTree className="transform rotate-45" />,
                text: "Properties",
                to: "/admin/properties"
            },
            {
                icon: <LeaderboardIcon />,
                text: "Projects",
                to: "/admin/projects"
            },
        ],
        <Divider key="" className="w-[85%] flex self-center" />,
        [
            {
                icon: <SettingsIcon />,
                text: "Settings",
                to: "/admin/settings"
            },
            {
                icon: <LogoutIcon />,
                text: "Log out",
                onClick: handlelogout
            },
        ],
    ];

    return (
        <Box sx={{ position: "relative" }}>
            {sidebarItems.map((group, index) => (
                <Fragment key={index}>
                    {Array.isArray(group) ? (
                        <List>
                            {group.map((item, itemIndex) => (
                                <SidebarItem
                                    key={itemIndex}
                                    open={open}
                                    icon={item.icon}
                                    text={item.text}
                                    to={item.to}
                                    onClick={item.onClick}
                                />
                            ))}
                        </List>
                    ) : (
                        group
                    )}
                </Fragment>
            ))}
        </Box>
    );
};

export default SidebarItems;
