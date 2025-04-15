export interface User {
	id: string;
	name: string;
	role: number;
}

export interface Client {
	id: string;
	nombre: string;
	identificacion: string;
	telefonos: string;
	sector: string;
	router: string;
	ipv4: string;
	plan: string;
	saldo: number;
	estado: string;
	// Add other client properties as needed
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
	clients: Client[];
	total: number;
}
export interface ClientStatsFiltered {
	todos: boolean;
	solventes: boolean;
	morosos: boolean;
	suspendidos: boolean;
	retirados: boolean;
}

export interface ClientsContextType {
	searchTerms: string;
	setSearchTerms: (term: string) => void;
	clientStatsFiltered: ClientStatsFiltered;
	setClientStatsFiltered: React.Dispatch<React.SetStateAction<ClientStats>>;
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	clients: Client[];
	filteredClients: Client[];
	loading: boolean;
	totalClients: number;
	refetchClients: () => void;
	// No se necesitan propiedades adicionales para infinite scroll
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
