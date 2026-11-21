import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/bell3friends/",
  test: { include: ["src/**/*.test.ts"] },
});
