import terser from "@rollup/plugin-terser";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig(({ mode }) => ({
  base: "/dare",
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/App.tsx"),
      preserveEntrySignatures: "exports-only",
      external: ["react", "react-dom"],
      output: {
        entryFileNames: "bundle.js",
        format: "esm",
      },
    },
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/playwright-tests/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/test/**",
        "**/mock/**",
        "**/*.config.{ts,js}",
      ],
    },
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/playwright-tests/**",
      "**/playwright-report/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
  server: {
    proxy: {
      ...(mode === "backend" && {
        "/dare-poc-api/api/": {
          target: "https://sokos-dare-poc.intern.dev.nav.no",
          rewrite: (path: string) => path.replace(/^\/dare-poc-api/, ""),
          changeOrigin: true,
          secure: false,
        },
      }),
      ...(mode === "localbackend" && {
        "/dare-poc-api/api/": {
          target: "http://localhost:8080/",
          rewrite: (path: string) => path.replace(/^\/dare-poc-api/, ""),
          changeOrigin: true,
          secure: false,
        },
      }),
      ...(mode === "mock" && {
        "/mockServiceWorker.js": {
          target: "http://localhost:5173",
          rewrite: () => "dare/mockServiceWorker.js",
        },
      }),
    },
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || "development",
    }),
    terser(),
  ],
}));
