/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_HOST_API: string;
	readonly VITE_HOST_API_G: string;
	readonly VITE_HOST_BCV: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
