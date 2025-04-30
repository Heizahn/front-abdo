import { Navigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { CircularProgress, Container } from '@mui/material';

/**
 * Componente que redirecciona a los usuarios a diferentes rutas según su rol
 */
export default function DefaultRedirect() {
	const { user, loading } = useAuth();

	// Si todavía está cargando, no hacemos nada (podríamos mostrar un spinner)
	if (loading) {
		return (
			<Container
				sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<CircularProgress />
			</Container>
		);
	}

	// Si no hay usuario o no tiene rol definido, redirigir al login
	if (!user || user.nRole === undefined) {
		return <Navigate to='/login' />;
	}

	switch (user.nRole) {
		case ROLES.PAYMENT_USER:
			return <Navigate to='/payments' />;
		case ROLES.ACCOUNTANT:
			return <Navigate to='/clients' />;
		case ROLES.PROVIDER:
			return <Navigate to='/clients' />;
		default:
			return <Navigate to='/home' />;
	}
}
