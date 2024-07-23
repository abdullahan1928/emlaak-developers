import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Greyed out background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Ensure it overlays everything
            }}
        >
            <Box textAlign="center">
                <CircularProgress color="inherit" />
                <Typography variant="h6" color="white" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        </Box>
    );
};

export default LoadingOverlay;
