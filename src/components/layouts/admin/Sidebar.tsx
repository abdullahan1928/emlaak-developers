import {
    Box,
    CSSObject,
    Divider,
    Theme,
    styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import drawerWidth from "./data/drawerWidth";
import SidebarItems from "./Sidebar/SidebarItems";
import Image from "next/image";
import { useRouter } from "next/navigation";

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(
    MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
    // hidden when screen size is medium
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    position: "relative",
}));

interface PrivateLayoutProps {
    open: boolean;
    handleLogout: () => Promise<void>;
    children: React.ReactNode;
}

const Sidebar = ({ open, handleLogout, children }: PrivateLayoutProps) => {
    const router = useRouter();

    return (
        <>
            <Drawer variant="permanent" open={open}>

                <Image
                    src="/logo.png"
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="flex self-center w-4/5 object-contain h-32 my-2 cursor-pointer"
                    onClick={() => router.push("/dashboard")}
                />

                <Divider className="w-[85%] flex self-center" />

                <SidebarItems open={open} handleLogout={handleLogout} />

            </Drawer >

            <Box component="main" sx={{ flexGrow: 1 }}>
                <DrawerHeader />

                {children}
            </Box>
        </>
    )
}

export default Sidebar