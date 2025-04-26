import React, { useState, useContext, createContext, ReactNode, useMemo } from 'react';
import { useFetchData } from '../hooks/useQuery';
import { Client, ClientsContextType } from '../interfaces/Interfaces';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

const ClientsContext = createContext<ClientsContextType>({
	searchTerms: '',
	setSearchTerms: () => {},
	clientStatsFiltered: {
		todos: true,
		solventes: false,
		morosos: false,
		suspendidos: false,
		retirados: false,
	},
	setClientStatsFiltered: () => {},
	handleSearchChange: () => {},
	clients: [],
	filteredClients: [],
	loading: false,
	totalClients: 0,
	refetchClients: () => {},
});

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
	const location = useLocation();

	// Obtener parámetros de la URL para el estado inicial
	const searchParams = new URLSearchParams(location.search);
	const [searchTerms, setSearchTerms] = useState(searchParams.get('search') || '');

	// Estado de filtro basado en los parámetros de URL
	const initialFilterState = () => {
		const estado = searchParams.get('estado');
		return {
			todos: !estado,
			solventes: estado === 'Activo-Solvente',
			morosos: estado === 'Activo-Moroso',
			suspendidos: estado === 'Suspendido',
			retirados: estado === 'Retirado',
		};
	};

	const [clientStatsFiltered, setClientStatsFiltered] = useState(initialFilterState());
	const debouncedSearchTerms = useDebounce(searchTerms, 300);

	const {
		data,
		isLoading: isClientsLoading,
		refetch: refetchClients,
	} = useFetchData<Client[]>('/clientsAll', 'all-clients');

	const clients = useMemo(() => {
		if (data) {
			return data;
		}
		return [];
	}, [data]);

	const totalClients = useMemo(() => {
		return clients.length;
	}, [clients]);

	// Filtrar clientes según búsqueda y estado seleccionado
	const filteredClients = useMemo(() => {
		if (clients.length === 0) {
			return [];
		}

		let result = [...clients];

		// Primero aplicar el filtro de búsqueda
		if (debouncedSearchTerms) {
			const searchLower = debouncedSearchTerms.toLowerCase();
			result = result.filter(
				(client) =>
					(client.nombre && client.nombre.toLowerCase().includes(searchLower)) ||
					(client.identificacion &&
						client.identificacion.toLowerCase().includes(searchLower)) ||
					(client.telefonos &&
						client.telefonos.toLowerCase().includes(searchLower)) ||
					(client.sector && client.sector.toLowerCase().includes(searchLower)) ||
					(client.ipv4 && client.ipv4.toLowerCase().includes(searchLower)) ||
					(client.router && client.router.toLowerCase().includes(searchLower)) ||
					(client.plan && client.plan.toLowerCase().includes(searchLower)),
			);
		}

		// Luego aplicar el filtro de estado
		if (clientStatsFiltered.todos) {
			result = result.filter((client) => client.estado !== 'Retirado');
		} else if (clientStatsFiltered.solventes) {
			result = result.filter(
				(client) => client.estado === 'Activo' && client.saldo >= 0,
			);
		} else if (clientStatsFiltered.morosos) {
			result = result.filter((client) => client.estado === 'Activo' && client.saldo < 0);
		} else if (clientStatsFiltered.suspendidos) {
			result = result.filter((client) => client.estado === 'Suspendido');
		} else if (clientStatsFiltered.retirados) {
			result = result.filter((client) => client.estado === 'Retirado');
		}

		return result;
	}, [clients, debouncedSearchTerms, clientStatsFiltered]);

	// Manejar cambio en la búsqueda
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms(event.target.value);
	};

	// Determinar si se está cargando alguno de los datos
	const loading = isClientsLoading;

	return (
		<ClientsContext.Provider
			value={{
				searchTerms,
				setSearchTerms,
				clientStatsFiltered,
				setClientStatsFiltered,
				handleSearchChange,
				clients,
				filteredClients,
				loading,
				totalClients,
				refetchClients,
			}}
		>
			{children}
		</ClientsContext.Provider>
	);
};

export const useClients = () => useContext(ClientsContext);
