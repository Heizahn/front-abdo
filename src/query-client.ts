import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 300000, // Aumentar a 5 minutos para reducir refetches innecesarios
			gcTime: 1000 * 60 * 60,
			refetchOnWindowFocus: false, // Cambiar a false para evitar refetches automáticos
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
});
