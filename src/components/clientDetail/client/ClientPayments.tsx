import React from 'react';
import { Box, Typography } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';

const ClientPayments = () => {
	const { client, loading } = useClientDetailsContext();

	if (loading) {
		return <Box>Cargando...</Box>;
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

			{client?.pagosTabla && client.pagosTabla.length > 0 ? (
				<Box>
					{/* Aquí puedes implementar una tabla o lista de pagos */}
					<pre>{JSON.stringify(client.pagosTabla, null, 2)}</pre>
				</Box>
			) : (
				<Typography variant='body1'>No hay pagos registrados</Typography>
			)}
		</Box>
	);
};

export default ClientPayments;
