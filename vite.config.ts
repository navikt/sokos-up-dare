import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => ({
	base: "/dare",
	build: {
		rolldownOptions: {
			input: resolve(import.meta.dirname, "src/App.tsx"),
			preserveEntrySignatures: "exports-only",
			plugins: [
				esmExternalRequirePlugin({
					external: ["react", "react-dom"],
				}),
			],
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
	plugins: [react(), cssInjectedByJsPlugin()],
}));
