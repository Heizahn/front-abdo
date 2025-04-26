# Documentación de Configuración

Este documento describe la configuración del proyecto y sus diferentes aspectos.

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

```typescript
interface ImportMetaEnv {
	readonly VITE_HOST_API: string;
	readonly VITE_HOST_API_G: string;
	readonly VITE_HOST_BCV: string;
}
```

### Descripción

-   `VITE_HOST_API`: URL base para las llamadas a la API principal
-   `VITE_HOST_API_G`: URL base para las llamadas a la API de otro proveedor
-   `VITE_HOST_BCV`: URL para obtener la tasa del BCV

## Configuración de React Query

El proyecto utiliza React Query con la siguiente configuración:

```typescript
const SYNC_CONFIG = {
	REAL_TIME: {
		refetchInterval: 5000, // 5 segundos
		staleTime: 3000, // 3 segundos
		gcTime: 60000, // 1 minuto
	},
	FREQUENT: {
		refetchInterval: 15000, // 15 segundos
		staleTime: 10000, // 10 segundos
		gcTime: 120000, // 2 minutos
	},
	NORMAL: {
		refetchInterval: 30000, // 30 segundos
		staleTime: 20000, // 20 segundos
		gcTime: 300000, // 5 minutos
	},
	SLOW: {
		refetchInterval: 60000, // 1 minuto
		staleTime: 45000, // 45 segundos
		gcTime: 600000, // 10 minutos
	},
};
```

### Configuración por Defecto

```typescript
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			...SYNC_CONFIG.FREQUENT,
			retry: 3,
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
});
```

## Configuración de Material-UI

El proyecto utiliza Material-UI con una configuración personalizada:

### Temas

-   Tema claro y oscuro
-   Colores personalizados para diferentes estados
-   Tipografía personalizada

### Componentes

-   Configuración global de componentes
-   Estilos consistentes
-   Responsive design

## Configuración de TypeScript

El proyecto utiliza TypeScript con las siguientes configuraciones:

### tsconfig.json

-   Strict mode activado
-   No se permite el uso de `any`
-   Configuración de paths para imports
-   Configuración de módulos

## Notas Importantes

-   Todas las configuraciones están tipadas
-   Se utilizan variables de entorno para configuraciones sensibles
-   La configuración de React Query es modular y reutilizable
-   Se implementan buenas prácticas de TypeScript
-   La configuración de Material-UI es consistente en toda la aplicación
