import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: Number(process.env.PORT) || 5173,
		host: '0.0.0.0',
	},

	preview: {
		port: Number(process.env.PORT) || 5173,
		host: '0.0.0.0',
	},
});
