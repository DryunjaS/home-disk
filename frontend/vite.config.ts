import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), commonjs(), viteSingleFile()],
  optimizeDeps: {
    include: ["@canvasjs/react-stockcharts"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
