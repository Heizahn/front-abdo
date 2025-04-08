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

export interface ClientViewPayment {
	deuda: 12;
	direccion: 'd1';
	estado: 'Retirado';
	fechaCreacion: '2021-05-28T21:03:04.731Z';
	fechaEdicion: '2023-05-10T13:54:23.162Z';
	fechaPago: 1;
	identificacion: 'V2';
	ipv4: '172.16.0.131';
	nombre: 'A2 A2';
	nombres: 'a2';
	routersId: '644ad2baf4ecb62da8a017c4';
	saldo: -12;
	sectoresId: '602ac0ae34cf8200044319a4';
	_id: '60b15a88a902e11db8dd7659';
}
