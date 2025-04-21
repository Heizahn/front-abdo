import { QueryClient } from '@tanstack/react-query';

// Configuraciones predefinidas para diferentes tipos de datos
const SYNC_CONFIG = {
    REAL_TIME: {
        refetchInterval: 5000,    // 5 segundos
        staleTime: 3000,          // 3 segundos
        gcTime: 60000,            // 1 minuto
    },
    FREQUENT: {
        refetchInterval: 15000,   // 15 segundos
        staleTime: 10000,         // 10 segundos
        gcTime: 120000,           // 2 minutos
    },
    NORMAL: {
        refetchInterval: 30000,   // 30 segundos
        staleTime: 20000,         // 20 segundos
        gcTime: 300000,           // 5 minutos
    },
    SLOW: {
        refetchInterval: 60000,   // 1 minuto
        staleTime: 45000,         // 45 segundos
        gcTime: 600000,           // 10 minutos
    }
};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			...SYNC_CONFIG.FREQUENT,
			retry: 3,
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
});

export { SYNC_CONFIG };