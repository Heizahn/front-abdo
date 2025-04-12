import { useQuery, QueryOptions, MutationOptions, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { HOST_API } from '../config/env';

export function useFetchData<T>(
	endpoint: string,
	queryKey: string,
	options?: Omit<QueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
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

export function useMutateDate<TData, TVariables>(
	endpoint: string,
	options?: Omit<MutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
	return useMutation<TData, Error, TVariables>({
		mutationFn: async (variables: TVariables) => {
			const response = await axios.post<TData>(`${HOST_API}${endpoint}`, variables);
			return response.data;
		},
		...options,
	});
}
