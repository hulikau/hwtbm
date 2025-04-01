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
        primary: "#5B7DB1",     // Slightly more vibrant blue
        secondary: "#F75D7E",   // Brighter coral/pink
        accent: "#FFCE6A",      // Brighter gold/yellow
        background: "#F8F9FA",  // Light neutral background
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};

export default config; 