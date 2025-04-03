// src/context/ClientDetailContext.tsx
import { createContext, ReactNode, useContext } from 'react';
import { ClientDetails } from '../interfaces/InterfacesClientDetails';
import { useParams } from 'react-router-dom';
import { useFetchData } from '../hooks/useQuery';

// Definir la interfaz del contexto
interface ClientContextType {
	client: ClientDetails | null;
	loading: boolean;
	error: Error | null;
}

// Crear el contexto con valores iniciales
const ClientContext = createContext<ClientContextType>({
	client: null,
	loading: true,
	error: null,
});

export const ClientDetailsProvider = ({ children }: { children: ReactNode }) => {
	const { id } = useParams();

	const {
		data,
		isLoading: loading,
		error,
	} = useFetchData<ClientDetails[]>(`/client/${id}`, `client-${id}`, {
		gcTime: 30000,
	});

	if (data) {
		const client = data[0];
		return (
			<ClientContext.Provider value={{ client, loading, error }}>
				{children}
			</ClientContext.Provider>
		);
	}
};

export const useClientDetailsContext = () => useContext(ClientContext);
