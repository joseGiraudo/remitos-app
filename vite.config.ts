import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base relativa para que el build funcione servido desde cualquier subruta
// (GitHub Pages, `npx serve dist`, etc.) sin configuracion extra.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
