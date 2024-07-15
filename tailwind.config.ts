import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F6D957",
          50: "#FEFDF6",
          100: "#FEFBDD",
          200: "#FDF8B2",
          300: "#FDF587",
          400: "#FCEF35",
          500: "#F6D957",
          600: "#F2C94F",
          700: "#E9B345",
          800: "#DFA93B",
          900: "#CE9930",
        },
        secondary: {
          DEFAULT: "#00A97F",
          50: "#E0F7F2",
          100: "#B3EDE2",
          200: "#80E0CF",
          300: "#4DD2BB",
          400: "#00BDA0",
          500: "#00A97F",
          600: "#009A71",
          700: "#007F5C",
          800: "#006348",
          900: "#00432E",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        futura: ["var(--font-futura)"],
      },
    },
  },
  plugins: [],
};
export default config;
