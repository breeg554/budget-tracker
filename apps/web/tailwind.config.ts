import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ECD9FA",
          100: "#D19DFF",
          150: "#9A5CD0",
          200: "#8E4EC6",
          250: "#8457AA",
          300: "#664282",
          400: "#54346B",
          500: "#48295C",
          600: "#3D224E",
          700: "#301C3B",
          800: "#1E1523",
          900: "#18111B",
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
      },
    },
  },
  plugins: [],
} satisfies Config;
