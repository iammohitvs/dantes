import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export const NODE_ENV: string = "development"

// https://vite.dev/config/
export default defineConfig({
  base: NODE_ENV === "production" ? "/dashboard/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
