import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--purple-1)",
          100: "var(--purple-2)",
          150: "var(--purple-3)",
          200: "var(--purple-4)",
          250: "var(--purple-5)",
          300: "var(--purple-6)",
          400: "var(--purple-7)",
          500: "var(--purple-8)",
          600: "var(--purple-9)",
          700: "var(--purple-10)",
          800: "var(--purple-11)",
          900: "var(--purple-12)",
        },
        secondary: {
          50: "#FFE0C2",
          100: "#FFA057",
          150: "#FF801F",
          200: "#F76B15",
          250: "#A35829",
          300: "#7E451D",
          400: "#66350C",
          500: "#562800",
          600: "#462100",
          700: "#331E0B",
          800: "#1E160F",
          900: "#17120E",
        },
        neutral: {
          50: "var(--gray-1)",
          100: "var(--gray-2)",
          150: "var(--gray-3)",
          200: "var(--gray-4)",
          250: "var(--gray-5)",
          300: "var(--gray-6)",
          400: "var(--gray-7)",
          500: "var(--gray-8)",
          600: "var(--gray-9)",
          700: "var(--gray-10)",
          800: "var(--gray-11)",
          900: "var(--gray-12)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
