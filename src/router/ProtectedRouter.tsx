import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRouter() {
	const { isAuthenticated, loading } = useAuth();

	// Mostrar un indicador de carga mientras verificamos la autenticación
	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Una vez que terminamos de cargar, verificar autenticación
	return isAuthenticated() ? <Outlet /> : <Navigate to='/login' />;
}
