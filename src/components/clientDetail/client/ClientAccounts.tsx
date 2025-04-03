import React from 'react';
import { Box, Typography } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import InvoicesTable, { Invoice } from './InvoicesTable';
import { Factura } from '../../../interfaces/InterfacesClientDetails';

const ClientAccounts: React.FC = () => {
	const { client, loading } = useClientDetailsContext();

	const formatInvoices = (): Invoice[] => {
		if (!client?.facturas) return [];

		return client.facturas.map((factura: Factura) => ({
			id: factura._id,
			motivo: factura.motivo,
			creado: factura.fecha,
			monto: factura.monto,
			deuda: factura.deuda,
			estado: factura.estado,
		}));
	};

	const handleAddInvoice = () => {
		console.log('Add new invoice');
	};

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

			{loading ? (
				<Box sx={{ textAlign: 'center', py: 2 }}>Cargando...</Box>
			) : (
				<InvoicesTable
					invoices={formatInvoices()}
					isLoading={loading}
					onAddInvoice={handleAddInvoice}
				/>
			)}
		</Box>
	);
};

export default ClientAccounts;
