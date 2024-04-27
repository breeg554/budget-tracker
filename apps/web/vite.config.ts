import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/__tests__", "**/*.(test|spec).(ts|tsx|js|jsx)"],
    },
  },
  plugins: [remix(), tsconfigPaths()],
});
