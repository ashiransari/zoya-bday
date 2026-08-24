import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // raw/ holds photo originals being copied in from a phone —
      // watching them crashes the dev server (EBUSY) mid-copy.
      ignored: ["**/raw/**", "**/.docx_render/**"],
    },
  },
});
