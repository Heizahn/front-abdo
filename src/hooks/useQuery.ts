import {
	useQuery,
	QueryOptions,
	MutationOptions,
	useMutation,
	UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { HOST_API } from '../config/env';
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Añadir abortController para cancelar peticiones si el componente se desmonta
export function useFetchData<T>(
	endpoint: string,
	queryKey: string,
	options?: Omit<QueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
): UseQueryResult<T, Error> {
	const { isAuthenticated } = useAuth();

	// Memoizar la función de consulta
	const fetchData = useCallback(async (): Promise<T> => {
		const controller = new AbortController();
		const signal = controller.signal;

		try {
			const response = await axios.get<T>(`${HOST_API}${endpoint}`, {
				signal,
				// Añadir caché para recursos estáticos
				headers: {
					'Cache-Control': endpoint.includes('static') ? 'max-age=3600' : 'no-cache',
				},
			});
			return response.data;
		} catch (error) {
			if (axios.isCancel(error)) {
				console.log('Request canceled:', endpoint);
			}
			throw error;
		}
	}, [endpoint]);

	return useQuery<T, Error, T>({
		queryKey: [queryKey],
		queryFn: fetchData,
		// No ejecutar si no estamos autenticados
		enabled: isAuthenticated(),
		// Permitir que las opciones personalizadas sobreescriban las predeterminadas
		...options,
	});
}

// Optimizar también useMutateDate
export function useMutateDate<TData, TVariables>(
	endpoint: string,
	options?: Omit<MutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
	const mutationFn = useCallback(
		async (variables: TVariables): Promise<TData> => {
			const response = await axios.post<TData>(`${HOST_API}${endpoint}`, variables);
			return response.data;
		},
		[endpoint],
	);

	return useMutation<TData, Error, TVariables>({
		mutationFn,
		...options,
	});
}
