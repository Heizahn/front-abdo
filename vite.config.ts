import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		compression(),
		visualizer({
			filename: "./dist/stats.html",
			open: true,
			gzipSize: true,
			brotliSize: true,
		}),
	],
	server: {
		port: Number(process.env.PORT) || 5173,
	},

	preview: {
		port: Number(process.env.PORT) || 5173,
		host: "0.0.0.0",
	},

	build: {
		target: "esnext",
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					mui_core: ["@mui/material"],
					mui_icons: ["@mui/icons-material"],
					charts: ["recharts"],
					utils: ["@tanstack/react-query"],
				},
			},
			treeshake: {
				moduleSideEffects: true,
				propertyReadSideEffects: true,
				tryCatchDeoptimization: false,
			},
		},
		chunkSizeWarningLimit: 1000,
	},

	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"react-router-dom",
			"@mui/material",
			"@mui/icons-material",
		],
	},
});
