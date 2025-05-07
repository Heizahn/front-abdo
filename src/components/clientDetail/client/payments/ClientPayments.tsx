import { Box, Typography } from '@mui/material';
import PaymentsTable from './PaymentsTable';
import { useFetchData } from '../../../../hooks/useQuery';
import { Pago } from '../../../../interfaces/InterfacesClientDetails';
import { useParams } from 'react-router-dom';
import { useClientDetailsContext } from '../../../../context/ClientDetailContext';

export default function ClientPayments() {
	const { id } = useParams();
	const { uploadPayments } = useClientDetailsContext();

	const { data: payments, isLoading } = useFetchData<Pago[]>(
		`/payments/client/${id}`,
		'payments-' + id,
	);

	if (!isLoading && payments) {
		uploadPayments(payments);
	}

	return (
		<Box
			sx={{
				p: 3,
				bgcolor: 'background.paper',
				borderBottomLeftRadius: 8,
				borderBottomRightRadius: 8,
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Typography variant='h6' gutterBottom>
				Historial de Pagos
			</Typography>

			<PaymentsTable payments={payments || []} isLoading={isLoading} />
		</Box>
	);
}
