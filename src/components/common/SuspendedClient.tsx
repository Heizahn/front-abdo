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
		refetchClients();
	};

	if (isButton) {
		return clientStatus === 'Suspendido' ? (
			<Button
				size='medium'
				title='Activar'
				color='success'
				variant='contained'
				onClick={handleStatus}
			>
				Activar
			</Button>
		) : (
			<Button
				size='medium'
				title='Suspender'
				color='error'
				variant='contained'
				onClick={handleStatus}
			>
				Suspender
			</Button>
		);
	}

	return clientStatus === 'Suspendido' ? (
		<IconButton size='medium' title='Activar' color='success' onClick={handleStatus}>
			<CheckIcon fontSize='medium' color='success' />
		</IconButton>
	) : (
		<IconButton size='medium' title='Suspender' color='error' onClick={handleStatus}>
			<SuspendeIcon fontSize='medium' color='error' />
		</IconButton>
	);
}
