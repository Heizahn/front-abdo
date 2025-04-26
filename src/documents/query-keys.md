# Documentación de Query Keys

Este documento contiene la lista de todas las query keys utilizadas en el proyecto, organizadas por funcionalidad.

## Clientes

-   `all-clients`: Lista completa de clientes
-   `clientsChart1`: Datos para el gráfico de clientes

## Pagos

-   `paysList`: Lista completa de pagos
-   `paysListSimple`: Lista simplificada de pagos
-   `paysBarChart0`: Datos para el gráfico de barras de pagos
-   `lastPays`: Últimos pagos realizados
-   `payments-{id}`: Pagos de un cliente específico
-   `paysPieChart0-{id}`: Datos para el gráfico circular de pagos de un cliente específico

## Sectores

-   `sectorsList`: Lista de sectores

## Servicios/Planes

-   `plansList`: Lista de planes de servicio

## Routers

-   `routersList`: Lista de routers

## Otros

-   `bcvData`: Datos del BCV (Banco Central de Venezuela)

## Notas

-   Las query keys que incluyen `{id}` son dinámicas y se generan con el ID específico del cliente
-   Todas las queries utilizan la configuración `FREQUENT` por defecto, que incluye:
    -   Refetch cada 15 segundos
    -   Tiempo de stale de 10 segundos
    -   Tiempo de GC de 2 minutos
