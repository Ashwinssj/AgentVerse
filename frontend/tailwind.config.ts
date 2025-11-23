import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                border: "var(--border)",
            },
            fontFamily: {
                sans: ["var(--font-space-grotesk)", "sans-serif"],
                display: ["var(--font-archivo-black)", "sans-serif"],
            },
            boxShadow: {
                'hard': '4px 4px 0px 0px var(--border)',
                'hard-sm': '2px 2px 0px 0px var(--border)',
            },
        },
    },
    plugins: [],
};
export default config;
