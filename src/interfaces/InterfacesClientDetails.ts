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
	_id: string;
	estado: string;
	monto: number;
	motivo: string;
	creadoPor: string;
	editadoPor: string | null;
	fecha: string;
	fechaEdicion: string | null;
	deuda: number;
}

export interface Pago {
	_id: string;
	cliente?: string;
	fecha: string;
	creadoPor: string;
	recibidoPor: string;
	estado: 'Activo' | 'Anulado' | string;
	tipoPago: 'Digital' | 'Efectivo' | string;
	referencia: string;
	comentario?: string;
	editadoPor?: string;
	fechaEdicion?: string;
	montoUSD: number;
	montoVES: number;
	motivo: string;
}

export interface ClientDetails {
	id: string;
	nombre: string;
	identificacion: string;
	telefonos: string;
	estado: string;
	ipv4: string;
	saldo: number;
	email: string;
	direccion: string;
	coordenadas: string;
	fechaCreacion: string;
	fechaPago: number;
	creadoPor: string;
	editadoPor: string | null;
	fechaEdicion: string | null;
	fechaRetiro: string | null;
	sector: string;
	plan: string;
	router: string;
	suspendidoPor: string;
	fechaSuspension: string | null;
	retiradoPor: string | null;
}

export interface ClientStats {
	_id: string;
	count: number;
	tipo: 'VES' | 'USD';
}
