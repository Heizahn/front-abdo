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
	const queryKeys = ['clients-stats', `client-${clientId}`, 'clients'];

	const handleWithdraw = async () => {
		const { status } = await axios.put(`${HOST_API}/clients/client/${clientId}/withdraw`, {
			idEditor: user?.id as string,
		});

		if (status === 204) {
			notifySuccess(`El cliente se ha retirado correctamente`, 'Cliente retirado');
		} else {
			notifyError('Error al retirar el cliente', 'Error al retirar el cliente');
		}

		queryKeys.forEach((key) => {
			queryClient.invalidateQueries({ queryKey: [key] });
		});
		refetchClients();
	};

	const handleActive = async () => {
		const { status } = await axios.put(`${HOST_API}/clients/client/${clientId}/activate`, {
			idEditor: user?.id as string,
		});

		if (status === 204) {
			notifySuccess(`El cliente se ha reactivado correctamente`, 'Cliente reactivado');
		} else {
			notifyError('Error al reactivar el cliente', 'Error al reactivar el cliente');
		}

		queryKeys.forEach((key) => {
			queryClient.invalidateQueries({ queryKey: [key] });
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
		if (clientStatus === 'Suspendido') {
			handleWithdraw();
		} else {
			handleActive();
		}
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
				<Tooltip title='Retirar cliente'>
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
