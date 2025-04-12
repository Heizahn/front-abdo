import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useFetchData } from '../hooks/useQuery';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState } from 'react';
import RouterHeader from '../components/routers/RouterHeader';
import Navigation from '../components/routers/Navigation';
import RouterDetail from '../components/routers/routerDetail/RouterDetail';
import EquipoSkeleton from '../components/routers/routerDetail/skeleton';
import ClientsTable from '../components/routers/routerClients/clientsTable';
import { RouterDetails } from '../interfaces/types';

export default function RouterView() {
	const { id } = useParams();
	const navigate = useNavigate();
	// Estado para controlar qué pestaña está activa
	const [activeTab, setActiveTab] = useState('details');

	// Manejador para cambios de pestaña
	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const { data: routerData, isLoading } = useFetchData<Array<RouterDetails>>(
		'/routersDetail/' + id,
		'router-' + id,
	);

	if (!routerData) {
		return (
			<MainLayout title='Router'>
				<EquipoSkeleton />;
			</MainLayout>
		);
	}

	// Función para renderizar el contenido según la pestaña activa
	const renderTabContent = () => {
		switch (activeTab) {
			case 'details':
				return <RouterDetail router={routerData && routerData[0]} />;
			case 'clients':
				return (
					<ClientsTable
						clients={routerData && routerData[0].clientes}
						routerId={id as string}
					/>
				);
			default:
				return <RouterDetail router={routerData && routerData[0]} />;
		}
	};

	return (
		<MainLayout title='Router'>
			{isLoading ? (
				<EquipoSkeleton />
			) : (
				<>
					{' '}
					<Box
						sx={{
							bgcolor: 'background.paper',
							pt: 1,
							px: 6,
							borderTopLeftRadius: 8,
							borderTopRightRadius: 8,
						}}
					>
						<Breadcrumbs
							separator={<NavigateNextIcon fontSize='small' />}
							aria-label='breadcrumb'
							sx={{ pt: 2 }}
						>
							<Link
								color='inherit'
								onClick={() => navigate('/routers')}
								sx={{ cursor: 'pointer' }}
							>
								Equipos
							</Link>
							<Typography color='text.primary'>Equipo</Typography>
						</Breadcrumbs>

						<RouterHeader
							activeTab={activeTab}
							router={routerData && routerData.length > 0 ? routerData[0] : null}
						/>

						<Navigation activeTab={activeTab} onTabChange={handleTabChange} />
					</Box>
					{/* Render el contenido de la pestaña activa */}
					{renderTabContent()}
				</>
			)}
		</MainLayout>
	);
}
