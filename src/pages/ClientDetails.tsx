import { useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClientHeader from '../components/clientDetail/layout/ClientHeader';
import Navigation from '../components/common/Navigation';
import ClientDetailsCard from '../components/clientDetail/client/ClientDetailCard';
import ClientAccounts from '../components/clientDetail/client/Invoices/ClientAccounts';
import ClientPayments from '../components/clientDetail/client/payments/ClientPayments';
import ClientStats from '../components/clientDetail/client/ClientStats';
import MainLayout from '../layouts/MainLayout';
import { ClientDetailsProvider } from '../context/ClientDetailContext';
import { useNavigate } from 'react-router-dom';

const ClientDetails = () => {
	const navigate = useNavigate();
	// Estado para controlar qué pestaña está activa
	const [activeTab, setActiveTab] = useState('details');

	const tabs = [
		{ label: 'Detalles del Cliente', value: 'details' },
		{ label: 'Cuentas por Cobrar', value: 'accounts' },
		{ label: 'Pagos', value: 'payments' },
		{ label: 'Estadísticas', value: 'stats' },
	];

	// Manejador para cambios de pestaña
	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	// Función para renderizar el contenido según la pestaña activa
	const renderTabContent = () => {
		switch (activeTab) {
			case 'details':
				return <ClientDetailsCard />;
			case 'accounts':
				return <ClientAccounts />;
			case 'payments':
				return <ClientPayments />;
			case 'stats':
				return <ClientStats />;
			default:
				return <ClientDetailsCard />;
		}
	};

	return (
		<MainLayout title='Detalles del cliente'>
			<ClientDetailsProvider>
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
							onClick={() => navigate('/clients')}
							sx={{ cursor: 'pointer' }}
						>
							Clientes
						</Link>
						<Typography color='text.primary'>Cliente</Typography>
					</Breadcrumbs>

					<ClientHeader activeTab={activeTab} />

					<Navigation
						activeTab={activeTab}
						onTabChange={handleTabChange}
						tabs={tabs}
					/>
				</Box>

				{renderTabContent()}
			</ClientDetailsProvider>
		</MainLayout>
	);
};

export default ClientDetails;
