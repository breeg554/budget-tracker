import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--default-font-family)", ...defaultTheme.fontFamily.sans],
      },
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
          50: "var(--orange-1)",
          100: "var(--orange-2)",
          150: "var(--orange-3)",
          200: "var(--orange-4)",
          250: "var(--orange-5)",
          300: "var(--orange-6)",
          400: "var(--orange-7)",
          500: "var(--orange-8)",
          600: "var(--orange-9)",
          700: "var(--orange-10)",
          800: "var(--orange-11)",
          900: "var(--orange-12)"
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
