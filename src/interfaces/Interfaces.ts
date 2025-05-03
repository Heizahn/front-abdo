export interface User {
	id: string;
	sName: string;
	nRole: number;
	idOwner?: string;
}
export interface IPaymentHistory {
	fecha: string;
	tipoPago: string;
	referencia: string;
	motivo: string;
	monto: number;
	montoVES: number;
}

export interface ILastInvoice {
	id: string;
	fecha: string;
	monto: number;
	estado: string;
	motivo: string;
}

// Agregar esta interfaz para el plan
export interface Plan {
	id: string;
	plan: string;
	// Otros campos que pueda tener el plan
}

export interface Client {
	id: string;
	sName: string;
	sDni: string;
	sRif?: string;
	sPhone: string;
	sector: string;
	sIp?: string;
	sGps?: string;
	sState: string;
	nBalance: number;
	plan?: string;
	nPayment?: number;
	nMBPS?: number;
}

export interface IClientPayment extends Client {
	fechaCorte: string;
	direccion: string;
	ultimosPagos: IPaymentHistory[];
	ultimasFacturas: ILastInvoice[];
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
