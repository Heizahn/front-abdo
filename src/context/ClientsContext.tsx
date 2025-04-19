import React, {
	useState,
	useContext,
	createContext,
	ReactNode,
	useMemo,
	useEffect,
} from 'react';
import { useFetchData } from '../hooks/useQuery';
import { Client, ClientsContextType, Plan } from '../interfaces/Interfaces';
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
	const [combinedClients, setCombinedClients] = useState<Client[]>([]);

	// Usar el hook personalizado para obtener todos los datos de clientes
	const {
		data: clientsData,
		isLoading: isClientsLoading,
		refetch: refetchClients,
	} = useFetchData<Client[]>('/clientsAll', 'all-clients');

	// Nuevo endpoint para obtener solo los planes
	const { data: plansData, isLoading: isPlansLoading } = useFetchData<Plan[]>(
		'/clientsAllPlansName',
		'all-plans',
	);

	// Inicialmente, configurar los clientes sin esperar los planes
	useEffect(() => {
		if (clientsData) {
			setCombinedClients(clientsData);
		}
	}, [clientsData]);

	// Cuando los planes estén disponibles, actualizar los clientes con nombres de planes
	useEffect(() => {
		if (clientsData && plansData) {
			// Crear un mapa de planes para búsqueda rápida por ID de cliente
			const plansMap = new Map<string | number, string>();
			plansData.forEach((plan) => {
				plansMap.set(plan.id, plan.plan);
			});

			// Actualizar los clientes con los nombres de planes
			const updatedClients = clientsData.map((client) => {
				const planName = plansMap.has(client.id)
					? plansMap.get(client.id)
					: client.plan;
				return {
					...client,
					plan: planName,
				};
			});

			setCombinedClients(updatedClients);
		}
	}, [clientsData, plansData]);

	const totalClients = useMemo(() => {
		return combinedClients.length;
	}, [combinedClients]);

	// Filtrar clientes según búsqueda y estado seleccionado
	const filteredClients = useMemo(() => {
		if (combinedClients.length === 0) {
			return [];
		}

		let result = [...combinedClients];

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
	}, [combinedClients, debouncedSearchTerms, clientStatsFiltered]);

	// Manejar cambio en la búsqueda
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms(event.target.value);
	};

	// Determinar si se está cargando alguno de los datos
	const loading = isClientsLoading || isPlansLoading;

	return (
		<ClientsContext.Provider
			value={{
				searchTerms,
				setSearchTerms,
				clientStatsFiltered,
				setClientStatsFiltered,
				handleSearchChange,
				clients: combinedClients,
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
