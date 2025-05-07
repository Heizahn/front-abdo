import { Box, Typography, Button, Avatar, Stack, Skeleton } from '@mui/material';
import { PersonRounded as PersonIcon } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import SuspendedClient from '../../common/SuspendedClient';
import ConfirmDialog from '../../common/Confirm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RetirarButton from '../../common/RetirarButton';

const ClientHeader = ({ activeTab }: { activeTab: string }) => {
	const { client, isEditing, setIsEditing, updateClient, isClientLoading, error } =
		useClientDetailsContext();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const navigate = useNavigate();

	const handleConfirm = () => {
		updateClient();
		setShowConfirmation(false);
	};

	if (isClientLoading) {
		return (
			<Box
				sx={{
					py: 3,
				}}
			>
				<Skeleton
					variant='rectangular'
					width='100%'
					height={100}
					sx={{ borderRadius: 3 }}
				/>
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				sx={{
					py: 3,
				}}
			>
				<Typography variant='h5' component='h1'>
					Error al cargar el cliente
				</Typography>
				{error.stack && error.stack.includes('403') ? (
					<Typography variant='body2' color='error'>
						No tienes permisos para ver este cliente
					</Typography>
				) : error.stack && error.stack.includes('404') ? (
					<Typography variant='body2' color='error'>
						Cliente no encontrado
					</Typography>
				) : (
					<Typography variant='body2' color='error'>
						(Bad Request) Formato del cliente no válido
					</Typography>
				)}
				<Button onClick={() => navigate('/clients')} variant='outlined' sx={{ mt: 2 }}>
					Volver Clientes
				</Button>
			</Box>
		);
	}
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
							{client && client.sName}
						</Typography>
						<StatusBadge
							status={client && client.sState}
							saldo={client && client.nBalance}
						/>
					</Stack>
					<Typography
						variant='body2'
						sx={{
							color:
								client && client.nBalance >= 0 ? 'success.main' : 'error.main',
							fontWeight: 'bold',
							fontSize: '1rem',
							textAlign: 'start',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						Saldo: {client && client.nBalance}
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
					<>
						{client?.sState !== 'Retirado' && (
							<SuspendedClient
								clientId={client?.id as string}
								isButton={true}
								clientStatus={client?.sState as string}
							/>
						)}
						{client?.sState !== 'Activo' && (
							<RetirarButton
								clientId={client?.id as string}
								isButton={true}
								clientStatus={client?.sState as string}
							/>
						)}
					</>
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
