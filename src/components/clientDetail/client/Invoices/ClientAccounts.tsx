import React from 'react';
import { Box, Typography } from '@mui/material';
import InvoicesTable from './InvoicesTable';
import { Factura } from '../../../../interfaces/InterfacesClientDetails';
import { useFetchData } from '../../../../hooks/useQuery';
import { useParams } from 'react-router-dom';

const ClientAccounts: React.FC = () => {
	const { id } = useParams();

	const { data: invoices, isLoading } = useFetchData<Factura[]>(
		`/client/${id}/invoices`,
		'invoices-' + id,
	);

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
				Cuentas por Cobrar
			</Typography>

			<InvoicesTable invoices={invoices ?? []} isLoading={isLoading} />
		</Box>
	);
};

export default ClientAccounts;
