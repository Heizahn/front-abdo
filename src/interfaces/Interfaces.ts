export interface User {
	id: string;
	name: string;
	role: number;
}

export interface Client {
	id: string;
	nombre: string;
	identificacion: string;
	sector: string;
	plan: string;
	ipv4?: string;
	telefonos: string;
	router?: string;
	saldo: number;
	estado: string;
}

export interface LastPays {
	id: string;
	motivo: string;
	cliente: string;
	fecha: string;
	montoUSD: number;
	montoVES: number;
	tipoPago: string;
	referencia: string;
	estado: string;
}

export interface CollectionsChartDTO {
	dim0: string;
	mea0: number;
	mea1: number;
	__id: string;
}

export interface PieChartDTO {
	dim0: string;
	mea0: string;
	__id: number;
}

interface ClientStats {
	todos: boolean;
	solventes: boolean;
	morosos: boolean;
	suspendidos: boolean;
	retirados: boolean;
}

export interface ClientsResponse {
	total: number;
	clients: Client[];
}

export interface ClientsContextType {
	searchTerms: string;
	setSearchTerms: (terms: string) => void;
	clientStatsFiltered: ClientStats;
	setClientStatsFiltered: React.Dispatch<React.SetStateAction<ClientStats>>;
	handleChangePage: (_: unknown, newPage: number) => void;
	handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	page: number;
	rowsPerPage: number;
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	clients: Client[];
	loading: boolean;
	totalClients: number;
	refetchClients: () => void;
}
