# Documentación de Interfaces

Este documento describe las interfaces y tipos principales utilizados en el proyecto.

## Interfaces Principales

### User

```typescript
interface User {
	id: string;
	name: string;
	role: number;
}
```

Representa un usuario del sistema con su ID, nombre y rol.

### Client

```typescript
interface Client {
	id: string;
	nombre: string;
	identificacion: string;
	telefonos: string;
	sector: string;
	ipv4: string;
	router: string;
	estado: string;
	saldo: number;
	plan?: string;
}
```

Representa un cliente con sus datos básicos y estado.

### IClientPayment

```typescript
interface IClientPayment extends Client {
	fechaCorte: string;
	direccion: string;
	ultimosPagos: IPaymentHistory[];
}
```

Extiende la interfaz Client con información adicional de pagos.

### PaymentDataForm

```typescript
type PaymentDataForm = {
	tipoPago: string;
	tipoMoneda: 'USD' | 'VES';
	referencia: string;
	comentario?: string;
	montoRef: number;
	montoBs: number;
	reciboPor: string;
	facturaId: string;
};
```

Formulario para la creación de pagos.

## Interfaces de Contexto

### AuthContextType

```typescript
interface AuthContextType {
	user: User | null;
	logout: () => void;
	isAuthenticated: () => boolean;
	loadUser: () => Promise<void>;
	loading: boolean;
	hasRole: (role: RoleType) => boolean;
	hasAccess: (requiredRoles?: RoleType[]) => boolean;
}
```

Define el tipo para el contexto de autenticación.

### NotificationContextType

```typescript
interface NotificationContextType {
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
```

Define el tipo para el contexto de notificaciones.

## Interfaces de Componentes

### ConfirmDialogProps

```typescript
interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}
```

Props para el componente de diálogo de confirmación.

### NotificationAlertProps

```typescript
interface NotificationAlertProps {
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
```

Props para el componente de alerta de notificación.

## Notas Importantes

-   Todas las interfaces están fuertemente tipadas
-   Se evita el uso de `any` en el código
-   Las interfaces se organizan por funcionalidad
-   Se utilizan tipos literales para valores específicos
-   Se implementan interfaces extendidas cuando es necesario
