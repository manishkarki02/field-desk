import { fileURLToPath, URL } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "src/app/router",
      generatedRouteTree: "src/app/router/-routeTree.gen.ts",
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/`,
      },
    ],
  },
});
