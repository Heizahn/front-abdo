# Documentación de Contextos

Este documento describe los contextos de React utilizados en el proyecto.

## AuthContext

El contexto de autenticación maneja el estado de autenticación del usuario y sus roles.

### Funcionalidades Principales

-   Gestión del estado de autenticación
-   Control de acceso basado en roles
-   Carga y actualización de datos del usuario
-   Cierre de sesión

### Uso

```typescript
const { user, isAuthenticated, hasRole, logout } = useAuth();
```

## NotificationContext

El contexto de notificaciones maneja las alertas y mensajes del sistema.

### Funcionalidades Principales

-   Mostrar notificaciones de diferentes tipos (success, error, warning, info)
-   Configuración de duración y posición de las notificaciones
-   Ocultar notificaciones

### Uso

```typescript
const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotification();
```

## ClientsContext

El contexto de clientes maneja el estado y las operaciones relacionadas con los clientes.

### Funcionalidades Principales

-   Lista de clientes
-   Filtrado y búsqueda de clientes
-   Estadísticas de clientes
-   Actualización de datos de clientes

### Uso

```typescript
const { clients, filteredClients, loading, totalClients } = useClientList();
```

## ClientDetailContext

El contexto de detalles del cliente maneja la información detallada de un cliente específico.

### Funcionalidades Principales

-   Datos detallados del cliente
-   Historial de pagos
-   Estadísticas del cliente
-   Actualización de información

### Uso

```typescript
const { client, isClientLoading, error } = useClientDetailsContext();
```

## Notas Importantes

-   Todos los contextos están fuertemente tipados
-   Se utilizan hooks personalizados para acceder a los contextos
-   Los contextos siguen el patrón de diseño de React Context
-   Se implementan validaciones de tipo en tiempo de compilación
-   Los contextos se organizan por funcionalidad específica
