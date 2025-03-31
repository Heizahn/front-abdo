import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { useFetchData } from '../hooks/useQuery';
import { ClientsContextType, ClientsResponse } from '../interfaces/Interfaces';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce'; // Hook personalizado para debounce

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
	handleChangePage: () => {},
	handleChangeRowsPerPage: () => {},
	page: 0,
	rowsPerPage: 20,
	handleSearchChange: () => {},
	clients: [],
	loading: false,
	totalClients: 0,
	refetchClients: () => {},
});

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Obtener parámetros de la URL
	const searchParams = new URLSearchParams(location.search);

	// Inicializar estados desde los parámetros de URL
	const [page, setPage] = useState(parseInt(searchParams.get('page') || '0'));
	const [rowsPerPage, setRowsPerPage] = useState(
		parseInt(searchParams.get('limit') || '20'),
	);
	const [searchTerms, setSearchTerms] = useState(searchParams.get('search') || '');

	// Estado de filtro basado en los parámetros de URL
	const initialFilterState = () => {
		const estado = searchParams.get('estado');
		return {
			todos: !estado,
			solventes: estado === 'Activo',
			morosos: estado === 'Moroso',
			suspendidos: estado === 'Suspendido',
			retirados: estado === 'Retirado',
		};
	};

	const [clientStatsFiltered, setClientStatsFiltered] = useState(initialFilterState());

	const debouncedSearchTerms = useDebounce(searchTerms, 300);

	// Actualizar la URL cuando cambian los parámetros
	useEffect(() => {
		const params = new URLSearchParams();

		if (page > 0) params.set('page', page.toString());
		if (rowsPerPage !== 20) params.set('limit', rowsPerPage.toString());
		if (debouncedSearchTerms) params.set('search', debouncedSearchTerms);

		const estado = getEstadoFromFilter();
		if (estado) params.set('estado', estado);

		// Actualizar la URL sin recargar la página
		navigate(
			{
				pathname: location.pathname,
				search: params.toString(),
			},
			{ replace: true },
		);
	}, [
		page,
		rowsPerPage,
		debouncedSearchTerms,
		clientStatsFiltered,
		navigate,
		location.pathname,
	]);

	// Determinar el estado basado en el filtro seleccionado
	const getEstadoFromFilter = (): string | undefined => {
		if (clientStatsFiltered.solventes) return 'Activo';
		if (clientStatsFiltered.morosos) return 'Moroso';
		if (clientStatsFiltered.suspendidos) return 'Suspendido';
		if (clientStatsFiltered.retirados) return 'Retirado';
		return undefined;
	};

	// Construir el endpoint con los parámetros de filtro y paginación
	const buildEndpoint = () => {
		// Calcular page+1 porque en el backend la página comienza en 1, pero en material-ui comienza en 0
		const backendPage = page + 1;
		const estado = getEstadoFromFilter();

		let endpoint = `/clientsWithFilters?page=${backendPage}&limit=${rowsPerPage}`;

		if (debouncedSearchTerms) {
			endpoint += `&search=${encodeURIComponent(debouncedSearchTerms)}`;
		}

		if (estado) {
			endpoint += `&estado=${encodeURIComponent(estado)}`;
		}

		return endpoint;
	};

	// Clave de consulta para React Query
	const queryKey = `clients-${page}-${rowsPerPage}-${debouncedSearchTerms}-${
		getEstadoFromFilter() || 'todos'
	}`;

	// Usar el hook personalizado para obtener los datos
	const { data, isLoading, refetch } = useFetchData<ClientsResponse>(
		buildEndpoint(),
		queryKey,
		{
			gcTime: Infinity,
		},
	);

	// Extraer los datos de la respuesta
	const clients = data?.clients || [];
	const totalClients = data?.total || 0;

	const refetchClients = () => {
		refetch();
	};

	// Manejar cambio en la búsqueda
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms(event.target.value);
		setPage(0);
	};

	// Manejar cambio de página
	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	// Manejar cambio de filas por página
	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<ClientsContext.Provider
			value={{
				page,
				rowsPerPage,
				searchTerms,
				setSearchTerms,
				clientStatsFiltered,
				setClientStatsFiltered,
				handleSearchChange,
				handleChangePage,
				handleChangeRowsPerPage,
				clients,
				loading: isLoading,
				totalClients,
				refetchClients,
			}}
		>
			{children}
		</ClientsContext.Provider>
	);
};

export const useClients = () => useContext(ClientsContext);
