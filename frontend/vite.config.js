import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In production Django serves the build under /static/, so asset URLs must start with it.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/static/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://127.0.0.1:8000" },
  },
}));
