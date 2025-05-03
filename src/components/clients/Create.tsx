import { Box } from '@mui/material';
import { ClientDataDTO, ClientFormData } from '../../interfaces/types';
import SimpleModalWrapper from '../common/ContainerForm';
import ClientFormWithConfirmation from './FormNewClient';
import { useAuth } from '../../context/AuthContext';
import { useMutateDate } from '../../hooks/useQuery';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { queryClient } from '../../query-client';
import { AxiosError } from 'axios';

const ClientsPage: React.FC = () => {
	const { user } = useAuth();
	const { refetchClients } = useClients();
	const { notifySuccess, notifyError } = useNotification();

	const queryKeys = ['clientsPieChart', 'clients-stats', 'clients'];

	const mutation = useMutateDate<ClientDataDTO, ClientDataDTO>('/clients', {
		onSuccess: () => {
			notifySuccess('El cliente se ha creado correctamente', 'Cliente creado');
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				console.log(err.response?.data);
				notifyError(err.response?.data.error.message, 'Error al crear el cliente');
			}
		},
	});

	const handleClientCreated = async (data: ClientFormData) => {
		const CreateDate = new Date().toISOString();
		let newClientData: Partial<ClientDataDTO> = {};

		newClientData = {
			sName: data.sName,
			sPhone: data.sPhone,
			sAddress: data.sAddress,
			sGps: data.sGps,
			sIp: data.sIp,
			idSector: data.idSector,
			idSubscription: data.idSubscription,
			sState: 'Activo',
			dCreation: CreateDate,
			nPayment: 7,
			sType: data.sType,
		};

		if (data.typeDni === 'J') {
			newClientData = {
				...newClientData,
				sRif: `J-${data.sDni}`,
			};
		} else {
			newClientData = {
				...newClientData,
				sDni: `${data.typeDni}-${data.sDni}`,
			};
		}

		if (user) {
			if (user.nRole === 3) {
				newClientData = {
					...newClientData,
					idOwner: user.id,
				};
			} else if (user.nRole === 5) {
				newClientData = {
					...newClientData,
					idOwner: user.idOwner,
				};
			} else {
				newClientData = {
					...newClientData,
					idOwner: data.idOwner,
				};
			}

			newClientData = {
				...newClientData,
				idCreator: user.id,
			};

			await mutation.mutateAsync(newClientData as ClientDataDTO);

			refetchClients();
		}
	};

	return (
		<Box>
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
