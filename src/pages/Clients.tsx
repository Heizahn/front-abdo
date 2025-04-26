import { Box, Typography } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

import TableClients from '../components/clients/TableClients';
import FilterStatusList from '../components/clients/filterStatusList';
import SearchInput from '../components/clients/SearchInput';
import { ClientsProvider } from '../context/ClientsContext';
import Create from '../components/clients/Create';
import { useAuth, ROLES } from '../context/AuthContext';

export default function Clients() {
	const { user } = useAuth();
	return (
		<MainLayout title='Clientes'>
			<ClientsProvider>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
						height: '95%',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							bgcolor: 'background.default',
							paddingRight: 2,
							borderTopLeftRadius: 8,
							borderTopRightRadius: 8,
						}}
					>
						<Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
							<FilterStatusList />
						</Box>

						{user?.role !== ROLES.PAYMENT_USER &&
							user?.role !== ROLES.ACCOUNTANT && (
								<Box>
									<Create />
								</Box>
							)}
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							bgcolor: 'background.default',
						}}
					>
						<Typography variant='h6'>Clientes</Typography>
						<SearchInput />
					</Box>

					<TableClients />
				</Box>
			</ClientsProvider>
		</MainLayout>
	);
}
