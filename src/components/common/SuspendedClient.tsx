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
			suspendidoPor?: string;
			fechaSuspension?: string;
			editadoPor?: string;
			fechaEdicion?: string;
			estado: string;
		} = {
			estado: '',
		};

		if (clientStatus === 'Activo') {
			newStatus.suspendidoPor = user?.id as string;
			newStatus.fechaSuspension = new Date().toISOString();
			newStatus.estado = 'Suspendido';
			newStatus.editadoPor = user?.id as string;
			newStatus.fechaEdicion = new Date().toISOString();
		} else if (clientStatus === 'Suspendido') {
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
					clientStatus === 'Suspendido' ? 'activado' : 'suspendido'
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
				{clientStatus === 'Suspendido' ? (
					<Button
						size='medium'
						color='success'
						variant='contained'
						onClick={handleShowConfirmation}
					>
						Activar
					</Button>
				) : (
					<Button
						size='medium'
						color='error'
						variant='contained'
						onClick={handleShowConfirmation}
					>
						Suspender
					</Button>
				)}
				{/* Confirmation Dialog */}
				<ConfirmDialog
					open={showConfirmation}
					onClose={handleCancelConfirmation}
					onConfirm={handleConfirm}
					title={
						clientStatus === 'Suspendido'
							? 'Confirmar activación'
							: 'Confirmar suspensión'
					}
					message={
						clientStatus === 'Suspendido'
							? '¿Está seguro que desea activar este cliente?'
							: '¿Está seguro que desea suspender este cliente?'
					}
					confirmText={clientStatus === 'Suspendido' ? 'Activar' : 'Suspender'}
					cancelText='Cancelar'
					confirmColor={clientStatus === 'Suspendido' ? 'success' : 'error'}
				/>
			</>
		);
	}

	return (
		<>
			{clientStatus === 'Suspendido' ? (
				<Tooltip title='Activar cliente'>
					<IconButton
						size='medium'
						color='success'
						onClick={handleShowConfirmation}
						sx={{ padding: 0 }}
					>
						<CheckIcon fontSize='medium' color='success' />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title='Suspender cliente'>
					<IconButton
						size='medium'
						color='error'
						onClick={handleShowConfirmation}
						sx={{ padding: 0 }}
					>
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
					clientStatus === 'Suspendido'
						? 'Confirmar activación'
						: 'Confirmar suspensión'
				}
				message={
					clientStatus === 'Suspendido'
						? '¿Está seguro que desea activar este cliente?'
						: '¿Está seguro que desea suspender este cliente?'
				}
				confirmText={clientStatus === 'Suspendido' ? 'Activar' : 'Suspender'}
				cancelText='Cancelar'
				confirmColor={clientStatus === 'Suspendido' ? 'success' : 'error'}
			/>
		</>
	);
}
