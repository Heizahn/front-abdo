import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import { PersonRounded as PersonIcon } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import SuspendedClient from '../../common/SuspendedClient';
import ConfirmDialog from '../../common/Confirm';
import { useState } from 'react';

const ClientHeader = ({ activeTab }: { activeTab: string }) => {
	const { client, isEditing, setIsEditing, updateClient } = useClientDetailsContext();
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleConfirm = () => {
		updateClient();
		setShowConfirmation(false);
	};

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
					<Button
						variant={isEditing ? 'outlined' : 'contained'}
						color='primary'
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? 'Cancelar' : 'Editar'}
					</Button>
				)}

				{!isEditing ? (
					<SuspendedClient
						clientId={client?.id as string}
						isButton={true}
						clientStatus={client?.estado as string}
					/>
				) : (
					<Button
						variant='contained'
						color='primary'
						onClick={() => setShowConfirmation(true)}
					>
						Guardar
					</Button>
				)}
			</Stack>

			<ConfirmDialog
				open={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				onConfirm={handleConfirm}
				title='Confirmar actualización'
				message='¿Está seguro que desea actualizar este cliente?'
				confirmText='Actualizar'
				cancelText='Cancelar'
			/>
		</Box>
	);
};

export default ClientHeader;
