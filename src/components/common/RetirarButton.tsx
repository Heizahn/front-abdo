import {
	CheckBoxRounded as CheckIcon,
	DangerousRounded as SuspendeIcon,
} from '@mui/icons-material';
import { Button, IconButton, Tooltip } from '@mui/material';
import { HOST_API } from '../../config/env';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { queryClient } from '../../query-client';
import ConfirmDialog from './Confirm';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SuspendedClient({
	clientStatus,
	clientId,
	isButton = false,
}: {
	clientStatus: string;
	clientId: string;
	isButton?: boolean;
}) {
	const { notifySuccess, notifyError } = useNotification();
	const { refetchClients } = useClients();
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const { user } = useAuth();

	const handleStatus = async () => {
		const newStatus: {
			estado: string;
			retiradoPor?: string;
			fechaRetiro?: string;
			editadoPor?: string;
			fechaEdicion?: string;
		} = {
			estado: '',
		};

		if (clientStatus === 'Suspendido') {
			newStatus.retiradoPor = user?.id as string;
			newStatus.fechaRetiro = new Date().toISOString();
			newStatus.estado = 'Retirado';
			newStatus.editadoPor = user?.id as string;
			newStatus.fechaEdicion = new Date().toISOString();
		} else if (clientStatus === 'Retirado') {
			newStatus.editadoPor = user?.id as string;
			newStatus.fechaEdicion = new Date().toISOString();
			newStatus.estado = 'Activo';
		}

		const { status } = await axios.patch(`${HOST_API}/clientes/${clientId}`, {
			...newStatus,
		});

		if (status === 204) {
			notifySuccess(
				`El cliente se ha ${
					clientStatus === 'Retirado' ? 'reactivado' : 'retirado'
				} correctamente`,
				'Cliente actualizado',
			);
		} else {
			notifyError('Error al actualizar el cliente', 'Error al actualizar el cliente');
		}

		queryClient.invalidateQueries({
			queryKey: ['clientsStats'],
		});
		queryClient.invalidateQueries({
			queryKey: [`client-${clientId}`],
		});
		refetchClients();
	};

	// Show confirmation dialog
	const handleShowConfirmation = () => {
		setShowConfirmation(true);
	};

	// Handle confirm action
	const handleConfirm = () => {
		setShowConfirmation(false);
		handleStatus();
	};

	// Handle cancel confirmation
	const handleCancelConfirmation = () => {
		setShowConfirmation(false);
	};

	if (isButton) {
		return (
			<>
				{clientStatus === 'Retirado' ? (
					<Button
						size='medium'
						color='success'
						variant='contained'
						onClick={handleShowConfirmation}
					>
						Reactivar
					</Button>
				) : (
					<Button
						size='medium'
						color='error'
						variant='contained'
						onClick={handleShowConfirmation}
					>
						Retirar
					</Button>
				)}
				{/* Confirmation Dialog */}
				<ConfirmDialog
					open={showConfirmation}
					onClose={handleCancelConfirmation}
					onConfirm={handleConfirm}
					title={
						clientStatus === 'Retirado'
							? 'Confirmar reactivación'
							: 'Confirmar retirada'
					}
					message={
						clientStatus === 'Retirado'
							? '¿Está seguro que desea reactivar este cliente?'
							: '¿Está seguro que desea retirar este cliente?'
					}
					confirmText={clientStatus === 'Retirado' ? 'Reactivar' : 'Retirar'}
					cancelText='Cancelar'
					confirmColor={clientStatus === 'Retirado' ? 'success' : 'error'}
				/>
			</>
		);
	}

	return (
		<>
			{clientStatus === 'Retirado' ? (
				<Tooltip title='Reactivar cliente'>
					<IconButton size='medium' color='success' onClick={handleShowConfirmation}>
						<CheckIcon fontSize='medium' color='success' />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title='Retirar cliente'>
					<IconButton size='medium' color='error' onClick={handleShowConfirmation}>
						<SuspendeIcon fontSize='medium' color='error' />
					</IconButton>
				</Tooltip>
			)}

			{/* Confirmation Dialog */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title={
					clientStatus === 'Retirado'
						? 'Confirmar reactivación'
						: 'Confirmar retirada'
				}
				message={
					clientStatus === 'Retirado'
						? '¿Está seguro que desea reactivar este cliente?'
						: '¿Está seguro que desea retirar este cliente?'
				}
				confirmText={clientStatus === 'Retirado' ? 'Reactivar' : 'Retirar'}
				cancelText='Cancelar'
				confirmColor={clientStatus === 'Retirado' ? 'success' : 'error'}
			/>
		</>
	);
}
