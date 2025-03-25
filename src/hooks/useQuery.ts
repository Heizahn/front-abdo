import { useQuery, QueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { HOST_API } from "../../vite-env.d";

const API_BASE_URL = HOST_API;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
});

export function useFetchData<T>(
    endpoint: string,
    queryKey: string,
    options?: Omit<QueryOptions<T, Error, T>, "queryKey" | "queryFn">
) {
    return useQuery<T, Error, T>({
        queryKey: [queryKey],
        queryFn: async (): Promise<T> => {
            const response = await apiClient.get<T>(endpoint);
            return response.data;
        },
        ...options,
    });
}
