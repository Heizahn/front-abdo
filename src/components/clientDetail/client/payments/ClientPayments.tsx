import { Box, Typography } from '@mui/material';
import { useClientDetailsContext } from '../../../../context/ClientDetailContext';
import PaymentsTable from './PaymentsTable';

export default function ClientPayments() {
	const { client, loading } = useClientDetailsContext();

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

			{loading ? (
				<Box sx={{ textAlign: 'center', py: 2 }}>Cargando...</Box>
			) : (
				<PaymentsTable payments={client?.pagosTabla || []} isLoading={loading} />
			)}
		</Box>
	);
}
