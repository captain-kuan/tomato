import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: resolve(__dirname, ".eslintrc-auto-import.json"),
      },
    }),
  ],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css:{
    preprocessorOptions:{
      scss:{
        additionalData:"@import '@/assets/stylesheets/_variables.scss';"
      }
    }
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
