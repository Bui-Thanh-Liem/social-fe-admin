import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    devSourcemap: true, // Set to true if you need CSS source maps in development
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
  build: {
    sourcemap: false, // Set to true if you need source maps in production
  },
});
