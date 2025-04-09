import { Box } from '@mui/material';
import { ClientDataDTO, ClientFormData, Subscription } from '../../interfaces/types';
import SimpleModalWrapper from '../common/ContainerForm';
import ClientFormWithConfirmation from './FormNewClient';
import { useAuth } from '../../context/AuthContext';
import { useMutateDate } from '../../hooks/useQuery';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { queryClient } from '../../query-client';

const ClientsPage: React.FC = () => {
	const { user } = useAuth();
	const { refetchClients } = useClients();
	const { notifySuccess, notifyError } = useNotification();

	type extend = Omit<ClientFormData, 'planesId'> & {
		id: string;
	};

	const queryKeys = ['clientsPieChart', 'clientsStats', 'clients'];

	const mutation = useMutateDate<extend, ClientDataDTO>('/clientes', {
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al crear el cliente');
			}
		},
	});

	const mutationSus = useMutateDate<
		{
			fecha: string;
			creadoPor: string;
			planesId: string;
			clientesId: string;
		},
		Subscription
	>('/suscripciones', {
		onSuccess: () => {
			notifySuccess(
				'El cliente se ha creado correctamente en el sistema',
				'Cliente creado',
			);
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al agregar el plan');
			}
		},
	});

	const handleClientCreated = async (data: ClientFormData) => {
		const { planesId } = data;
		const CreateDate = new Date().toISOString();
		if (user) {
			const newClientData: ClientDataDTO = {
				nombre: data.nombre,
				email: data.email,
				telefonos: data.telefonos,
				direccion: data.direccion,
				coordenadas: data.coordenadas,
				identificacion: data.identificacion,
				ipv4: data.ipv4,
				routersId: data.routersId,
				sectoresId: data.sectoresId,
				estado: 'Activo',
				creadoPor: user.id,
				fechaCreacion: CreateDate,
				fechaPago: 7,
				saldo: 0,
			};

			console.log('newClientData', newClientData);
			const res = await mutation.mutateAsync(newClientData);

			await mutationSus.mutateAsync({
				clientesId: res.id,
				planesId,
				fecha: CreateDate,
				creadoPor: user.id,
			});

			refetchClients();
		}
	};

	return (
		<Box sx={{ my: 2 }}>
			<SimpleModalWrapper
				triggerButtonText='Crear'
				triggerButtonColor='primary'
				showCloseButton={false}
			>
				<ClientFormWithConfirmation
					onSubmit={handleClientCreated}
					onCancel={() => {}}
				/>
			</SimpleModalWrapper>
		</Box>
	);
};

export default ClientsPage;
