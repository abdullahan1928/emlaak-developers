"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    secondary: {
      main: "#F6D957",
      light: "#FEFBDD",
      dark: "#CE9930",
      contrastText: "#000000",
    },
    primary: {
      main: "#00A97F",
      light: "#B3EDE2",
      dark: "#00432E",
      contrastText: "#FFFFFF",
    },
  },
});

export default theme;
