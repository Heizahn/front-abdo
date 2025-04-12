import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { HOST_API } from '../../../config/env';
import { useNotification } from '../../../context/NotificationContext';
import { useParams } from 'react-router-dom';
import { queryClient } from '../../../query-client';

// Separamos el diálogo para asegurarnos de que no hay problemas de renderizado
import ConfirmDialog from '../../common/Confirm';

export default function QuitRouterButton({ clientId }: { clientId: string }) {
	// Estados básicos
	const [sending, setSending] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Hooks y parámetros
	const { notifyError, notifyInfo } = useNotification();
	const { id: routerId } = useParams();
	const queryKeys = ['router-' + routerId, 'client-', 'clients-'];

	// Acción principal
	const removeClientFromRouter = async () => {
		setSending(true);
		setDialogOpen(false);

		try {
			await axios.patch(`${HOST_API}/clientes/${clientId}`, {
				routersId: '',
			});

			notifyInfo('Cliente quitado correctamente', 'Cliente quitado');

			// Invalidar consultas
			for (const key of queryKeys) {
				await queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al quitar el cliente');
			} else {
				notifyError('Error desconocido', 'Error al quitar el cliente');
			}
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			{/* Botón simple */}
			<Button
				variant='outlined'
				color='error'
				size='small'
				disabled={sending}
				onClick={() => setDialogOpen(true)}
			>
				{sending ? (
					<>
						<CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
						Quitando...
					</>
				) : (
					'Quitar'
				)}
			</Button>

			{/* Diálogo separado con props explícitas */}
			{dialogOpen && (
				<ConfirmDialog
					open={dialogOpen}
					title='Confirmar acción'
					message='¿Está seguro que desea quitar este cliente del router?'
					confirmText='Quitar'
					cancelText='Cancelar'
					confirmColor='error'
					onConfirm={removeClientFromRouter}
					onClose={() => setDialogOpen(false)}
				/>
			)}
		</>
	);
}
