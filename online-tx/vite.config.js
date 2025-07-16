import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ✅ use this one

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://onlinetxmanag.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
