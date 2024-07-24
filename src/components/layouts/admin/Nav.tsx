import {
    Toolbar,
    Typography,
    styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import drawerWidth from "./data/drawerWidth";
import ToggleSidebarButton from "./Nav/ToggleSidebarButton";
import NavMenu from "./Nav/NavMenu";

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    position: "fixed",
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    ...(!open && {
        width: `calc(100% - ${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${theme.spacing(8)} + 1px)`,
        },
    }),
    boxShadow: "none",
    backgroundColor: "white",
    border: "1px solid #dbe0eb",
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

interface AppBarProps extends MuiAppBarProps {
    open: boolean;
    setOpen?: any;
    handleLogout?: () => Promise<void>;
}

const Nav = ({ open, setOpen, handleLogout = () => Promise.resolve() }: AppBarProps) => {

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                <div className="flex items-center gap-12 max-lg:hidden">
                    <ToggleSidebarButton
                        open={open}
                        toggleDrawer={toggleDrawer}
                    />
                </div>

                <Typography color="secondary" variant="h6" noWrap component="div">
                </Typography>

                <div className="flex items-center gap-12 max-lg:gap-6">

                    <NavMenu handleLogout={handleLogout} />
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Nav;
