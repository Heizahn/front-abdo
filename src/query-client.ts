import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30000,
            gcTime: 1000 * 60 * 60,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
        },
    },
});
