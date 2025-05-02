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
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							bgcolor: 'background.default',
							paddingY: 1,
							paddingX: 2,
						}}
					>
						<Typography variant='h6'>Clientes</Typography>

						<Box
							sx={{
								display: 'flex',
								gap: 4,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{user?.nRole !== ROLES.PAYMENT_USER &&
								user?.nRole !== ROLES.ACCOUNTANT && (
									<Box>
										<Create />
									</Box>
								)}
							<SearchInput />
						</Box>
					</Box>

					<TableClients />
				</Box>
			</ClientsProvider>
		</MainLayout>
	);
}
