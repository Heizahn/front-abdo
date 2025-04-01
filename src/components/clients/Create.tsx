import { Box } from '@mui/material';
import { ClientDataDTO, ClientFormData } from '../../interfaces/types';
import SimpleModalWrapper from '../common/ContainerForm';
import ClientFormWithConfirmation from './FormNewClient';
import { useAuth } from '../../context/AuthContext';
import { useMutateDate } from '../../hooks/useQuery';

const ClientsPage: React.FC = () => {
	const { user } = useAuth();
	const mutation = useMutateDate<ClientDataDTO, ClientFormData>(
		'/clientes',
		{
			onSuccess: () => {
				console.log('Cliente creado');
			},
			onError: (err) => {
				console.log('Error al crear cliente');
				console.log(err);
			},
		},
		['clientsPieChart', 'clients', 'clientsStats'],
	);

	const handleClientCreated = async (data: ClientFormData) => {
		if (user) {
			const newClientData: ClientDataDTO = {
				...data,
				estado: 'Activo',
				creadoPor: user.id,
				fechaCreacion: new Date().toISOString(),
			};

			mutation.mutate(newClientData);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			{/* Opción 1: Botón simple */}
			<Box sx={{ mb: 2 }}>
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
		</Box>
	);
};

export default ClientsPage;
