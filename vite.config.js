import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  // Base path for GitHub Pages deployment
  // Change 'nft_dev' to your actual repository name when deploying
  base: "/nft_dev/",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
