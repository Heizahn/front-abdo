import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, ROLES, RoleType } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

// Definimos qué rutas están permitidas para cada rol
const ROLE_ROUTES: Record<RoleType, string[]> = {
	[ROLES.SUPERADMIN]: ['*'], // Superadmin tiene acceso a todas las rutas
	[ROLES.ADMIN]: ['/clients', '/client', '/payments'], // Admin tiene acceso a estas rutas
	[ROLES.PAYMENT_USER]: ['/payments'], // Usuario de pagos solo tiene acceso a payments
};

interface ProtectedRouterProps {
	requiredRoles?: RoleType[];
}

export default function ProtectedRouter({ requiredRoles = [] }: ProtectedRouterProps) {
	const { isAuthenticated, loading, user } = useAuth();
	const location = useLocation();

	// Función para verificar si el usuario tiene acceso a la ruta actual según su rol
	const hasRoleAccess = (): boolean => {
		// Si no se especificaron roles requeridos, permitimos acceso a cualquier usuario autenticado
		if (requiredRoles.length === 0) return true;

		// Si el usuario no tiene rol definido, no permitimos acceso
		if (!user || typeof user.role !== 'number') return false;

		// Verificamos si el rol del usuario está entre los roles permitidos
		if (requiredRoles.includes(user.role as RoleType)) return true;

		// Verificamos si la ruta actual está permitida para el rol del usuario
		const allowedRoutes = ROLE_ROUTES[user.role as RoleType] || [];

		// Si el rol tiene acceso a todas las rutas
		if (allowedRoutes.includes('*')) return true;

		// Verificamos si la ruta actual está en la lista de rutas permitidas
		return allowedRoutes.some((route) => {
			// Verificación exacta o si la ruta comienza con el patrón
			return location.pathname === route || location.pathname.startsWith(`${route}/`);
		});
	};

	// Mostrar un indicador de carga mientras verificamos la autenticación
	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<CircularProgress />
				<Typography variant='body2' color='text.secondary'>
					Verificando credenciales...
				</Typography>
			</Box>
		);
	}

	// Si el usuario no está autenticado, redirigimos al login
	if (!isAuthenticated()) {
		return <Navigate to='/login' />;
	}

	// Si el usuario está autenticado pero no tiene el rol requerido
	if (!hasRoleAccess()) {
		return (
			<Navigate
				to={user?.role === ROLES.PAYMENT_USER ? '/payments' : '/home'}
				replace
				state={{ from: location }}
			/>
		);
	}

	// Si está autenticado y tiene el rol correcto, mostramos el contenido
	return <Outlet />;
}

// Exportamos las constantes de roles para que sean accesibles desde este módulo también
export { ROLES };
export type { RoleType };
