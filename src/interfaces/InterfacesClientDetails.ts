import { Client } from './Interfaces';

export interface Sector {
	_id: string;
	nombre: string;
	estado: string;
}

export interface Plan {
	_id: string;
	nombre: string;
	costo: number;
	estado: string;
	creadoPor: string;
	fechaCreacion: string;
}

export interface Suscripcion {
	_id: string;
	fecha: string;
	creadoPor: string;
	planesId: string;
	clientesId: string;
	planes: Plan[];
}

export interface Router {
	_id: string;
	nombre: string;
	ip: string;
	fechaCreacion: string;
	creadoPor: string;
	estado: string;
	direccion: string;
	descripcion: string;
	sectoresId: string;
}

export interface Factura {
	id: string;
	sState: string;
	nAmount: number;
	sReason: string;
	idCreator: string;
	idEditor: string | null;
	dCreation: string;
	dEdition: string | null;
	debt: number;
	creator: string;
	editor: string;
}

export interface Pago {
	id: string;
	nAmount: number;
	nBs: number;
	bCash: boolean;
	bUSD: boolean;
	sReference: string;
	sCommentary: string;
	sReason: string;
	sState: string;
	creator: string;
	editor: string;
	dCreation: string;
	dEdition: string;
}

export interface ClientDetails extends Client {
	sSn: string;
	sMac: string;
	sType: string;
	sAddress: string;
	sCommentary: string;
	idSector: string;
	idSubscription: string;
	idEditor: string;
	dCreation: string;
	dSuspension: string;
	dEdition: string;
	creator: string;
	editor: string;
	installer: string;
	suspender: string;
}

export interface ClientStats {
	_id: string;
	count: number;
	tipo: 'VES' | 'USD';
}
