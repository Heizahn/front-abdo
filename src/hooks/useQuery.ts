import { useQuery, QueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { HOST_API } from "../../vite-env.d";

export function useFetchData<T>(
    endpoint: string,
    queryKey: string,
    options?: Omit<QueryOptions<T, Error, T>, "queryKey" | "queryFn">
) {
    return useQuery<T, Error, T>({
        queryKey: [queryKey],
        queryFn: async (): Promise<T> => {
            const response = await axios.get<T>(`${HOST_API}${endpoint}`);
            return response.data;
        },
        ...options,
    });
}
