import { AlertColor } from '@mui/material';
import { ReactNode } from 'react';

export type ClientFormData = {
	nombre: string;
	identificacion: string;
	telefonos: string;
	direccion: string;
	email: string;
	sectoresId: string;
	coordenadas: string;
	planesId: string;
	ipv4: string;
	routersId: string;
};

export type ClientDataDTO = Omit<ClientFormData, 'planesId'> & {
	estado: string;
	creadoPor: string;
	fechaCreacion: string;
	fechaPago: number;
	saldo: number;
};

export interface SelectList {
	id?: string;
	_id?: string;
	nombre: string;
}

export interface SimpleModalWrapperProps {
	/** Contenido a mostrar en el modal */
	children: ReactNode;
	/** Componente de activación personalizado (opcional) */
	triggerComponent?: ReactNode;
	/** Texto del botón de activación (si no se proporciona un componente personalizado) */
	triggerButtonText?: string;
	/** Tipo de botón para mostrar (default: button, fab: botón flotante circular) */
	triggerButtonType?: 'button' | 'fab';
	/** Texto del tooltip para el botón (solo para fab) */
	triggerTooltip?: string;
	/** Estilos adicionales para el botón de activación */
	triggerButtonSx?: object;
	/** Color del botón */
	triggerButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	/** Ancho máximo del diálogo */
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
	/** Si el modal debe ser de pantalla completa */
	fullScreen?: boolean;
	/** Si debe mostrar el botón de cerrar en la esquina superior derecha */
	showCloseButton?: boolean;
	/**Tamaño del botón */
	size?: 'small' | 'medium' | 'large';
	/**Icono para el botón */
	icon?: ReactNode;
}

export interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface NotificationAlertProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	message: string;
	severity?: AlertColor;
	autoHideDuration?: number;
	position?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
}

// Tipo para la información de notificación
export interface NotificationInfo {
	open: boolean;
	title?: string;
	message: string;
	severity: AlertColor;
	autoHideDuration?: number;
	position?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
}

// Tipo para el contexto
export interface NotificationContextType {
	showNotification: (
		message: string,
		severity?: AlertColor,
		title?: string,
		duration?: number,
		position?: {
			vertical: 'top' | 'bottom';
			horizontal: 'left' | 'center' | 'right';
		},
	) => void;
	hideNotification: () => void;
	notifySuccess: (message: string, title?: string) => void;
	notifyError: (message: string, title?: string) => void;
	notifyWarning: (message: string, title?: string) => void;
	notifyInfo: (message: string, title?: string) => void;
}

export type Subscription = {
	fecha: string;
	creadoPor: string;
	planesId: string;
	clientesId: string;
};

export type PaymentDataForm = {
	tipoPago: string;
	tipoMoneda: 'USD' | 'VES';
	referencia: string;
	comentario?: string;
	montoRef: number;
	montoBs: number;
	reciboPor: string;
	facturaId: string;
};

export type PaymentDTO = Partial<PaymentDataForm> & {
	monto: number;
	fecha: string;
	creadoPor: string;
	estado: string;
	recibidoPor: string;
	tipo: 1 | 2;
	tasa: number;
	clientesId: string;
};

export type Invoice = {
	id: string;
	fechaFacturacion: string;
	estado: string;
	monto: number;
	deuda: number;
	motivo: string;
	creadoPor: string;
	editadoPor?: string;
	fechaEdicion?: string;
	clientesId: string;
};

export interface ClientRouterTable {
	_id: string;
	nombre: string;
	identificacion: string;
	ipv4: string;
	estado: string;
	editadoPor?: string;
	fechaEdicion?: string;
}

export interface SectorRouter {
	_id: string;
	nombre: string;
}

export interface RouterDetails {
	_id: string;
	nombre: string;
	ip: string;
	fechaCreacion: string;
	creadoPor: string;
	fechaEdicion?: string;
	editadoPor?: string;
	estado: string;
	direccion: string;
	descripcion: string;
	sectores: SectorRouter;
	clientes: ClientRouterTable[];
}
