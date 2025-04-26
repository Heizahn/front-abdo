# Documentación de Componentes

Este documento describe los componentes principales utilizados en el proyecto.

## Componentes de Clientes

### ClientTable

Tabla principal para mostrar la lista de clientes.

#### Características

-   Búsqueda y filtrado
-   Ordenamiento
-   Infinity scroll
-   Virtualización de clientes
-   Acciones por cliente

#### Props

```typescript
interface ClientTableProps {
	clients: Client[];
	loading: boolean;
	onEdit: (client: Client) => void;
	onDelete: (client: Client) => void;
}
```

### ClientDetail

Muestra los detalles de un cliente específico.

#### Características

-   Información detallada
-   Historial de pagos
-   Estadísticas
-   Edición de datos

#### Props

```typescript
interface ClientDetailProps {
	client: Client;
	onClose: () => void;
}
```

## Componentes de Pagos

### PaymentForm

Formulario para crear y editar pagos.

#### Características

-   Validación de datos
-   Cálculo automático de montos
-   Selección de tipo de pago
-   Referencias

#### Props

```typescript
interface PaymentFormProps {
	onSubmit: (data: PaymentDataForm) => void;
	onCancel: () => void;
	initialData?: PaymentDataForm;
}
```

### PaymentHistory

Muestra el historial de pagos de un cliente.

#### Características

-   Lista de pagos
-   Filtrado por fecha
-   Detalles de cada pago
-   Exportación de datos

#### Props

```typescript
interface PaymentHistoryProps {
	payments: IPaymentHistory[];
	loading: boolean;
}
```

## Componentes de Gráficos

### CollectionsChart

Gráfico de barras para mostrar recaudaciones.

#### Características

-   Datos en tiempo real
-   Múltiples monedas
-   Tooltips interactivos
-   Responsive

#### Props

```typescript
interface CollectionsChartProps {
	data: CollectionsChartDTO[];
	loading: boolean;
}
```

### MonthlyCollection

Gráfico de barras para mostrar recaudaciones mensuales.

#### Características

-   Datos mensuales
-   Comparación de monedas
-   Etiquetas personalizadas
-   Responsive

#### Props

```typescript
interface MonthlyCollectionProps {
	data: MonthlyCollectionDTO[];
	loading: boolean;
}
```

## Componentes Comunes

### ConfirmDialog

Diálogo de confirmación reutilizable.

#### Características

-   Personalizable
-   Diferentes tipos de alerta
-   Acciones personalizadas
-   Animaciones

#### Props

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

### NotificationAlert

Componente de notificación.

#### Características

-   Diferentes tipos de notificación
-   Duración configurable
-   Posición personalizable
-   Animaciones

#### Props

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

## Notas Importantes

-   Todos los componentes están fuertemente tipados
-   Se utilizan hooks personalizados para la lógica
-   Los componentes son funcionales
-   Se implementa el patrón de composición
-   Se utilizan componentes de Material-UI como base
-   Los componentes son responsivos
-   Se implementan buenas prácticas de React
-   Se utilizan PropTypes para validación adicional
-   Los componentes son reutilizables
-   Se implementan pruebas unitarias
