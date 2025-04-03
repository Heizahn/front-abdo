import {
	CheckBoxOutlined as CheckIcon,
	DangerousOutlined as SuspendeIcon,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { HOST_API } from '../../../vite-env.d';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { queryClient } from '../../query-client';
import ConfirmDialog from './Confirm';
import { useState } from 'react';

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

	const handleStatus = async () => {
		const { status } = await axios.patch(`${HOST_API}/clientes/${clientId}`, {
			estado: clientStatus === 'Suspendido' ? 'Activo' : 'Suspendido',
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
						title='Activar'
						color='success'
						variant='contained'
						onClick={handleShowConfirmation}
					>
						Activar
					</Button>
				) : (
					<Button
						size='medium'
						title='Suspender'
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
				<IconButton
					size='medium'
					title='Activar'
					color='success'
					onClick={handleShowConfirmation}
				>
					<CheckIcon fontSize='medium' color='success' />
				</IconButton>
			) : (
				<IconButton
					size='medium'
					title='Suspender'
					color='error'
					onClick={handleShowConfirmation}
				>
					<SuspendeIcon fontSize='medium' color='error' />
				</IconButton>
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
