import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    open: boolean;
    icon: React.ReactNode;
    text: string;
    to?: string;
    onClick?: () => void;
}

const SidebarItem = ({ open, icon, text, to, onClick }: SidebarItemProps) => {
    const path = usePathname();

    const isActive =
        to && to !== '/dashboard'
            ? path.startsWith(to)
            : path === to;

    return (
        <ListItem disablePadding sx={{ display: "block" }}>
            <Link href={to || "#"} style={{ textDecoration: "none" }}>
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        margin: 1,
                        borderRadius: 2,
                        ...(isActive && {
                            color: "primary.main",
                            backgroundColor: "primary.100",
                            "& svg": {
                                color: "primary.main",
                            },
                            borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                        }),
                    }}
                    onClick={onClick}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
};


export default SidebarItem