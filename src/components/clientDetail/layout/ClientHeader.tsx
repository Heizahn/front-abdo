import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import { PersonRounded as PersonIcon } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import SuspendedClient from '../../common/SuspendedClient';

const ClientHeader = ({ activeTab }: { activeTab: string }) => {
	const { client } = useClientDetailsContext();

	return (
		<Box
			sx={{
				p: 2,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Stack direction='row' spacing={2} alignItems='center'>
				<Avatar sx={{ bgcolor: 'primary.main' }}>
					<PersonIcon />
				</Avatar>
				<Box>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Typography variant='h5' component='h1'>
							{client && client.nombre}
						</Typography>
						<StatusBadge
							status={client && client.estado}
							saldo={client && client.saldo}
						/>
					</Stack>
					<Typography
						variant='body2'
						sx={{
							color: client && client.saldo >= 0 ? 'success.main' : 'error.main',
							fontWeight: 'bold',
							fontSize: '1rem',
							textAlign: 'start',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						Saldo: {client && client.saldo}$
					</Typography>
				</Box>
			</Stack>
			<Stack direction='row' spacing={1}>
				{activeTab === 'details' && (
					<Button variant='contained' color='primary'>
						Editar
					</Button>
				)}
				<SuspendedClient
					clientId={client?.id as string}
					isButton={true}
					clientStatus={client?.estado as string}
				/>
			</Stack>
		</Box>
	);
};

export default ClientHeader;
