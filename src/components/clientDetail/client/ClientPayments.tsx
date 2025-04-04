import { Box, Typography } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import PaymentsTable from './PaymentsTable';
import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../context/NotificationContext';
import { HOST_API } from '../../../../vite-env.d';

export default function ClientPayments() {
	const [isSending, setIsSending] = useState(false);
	const { client, loading } = useClientDetailsContext();

	const { notifyError, notifySuccess, notifyInfo } = useNotification();

	const handleSendPayment = async (id: string) => {
		setIsSending(true);
		notifyInfo('Enviando pago a ' + client?.nombre);
		try {
			const { data } = await axios.get(HOST_API + '/send-pay/' + id);

			if (data.success) {
				notifySuccess(
					'Recibo enviado exitosamente al cliente ' + client?.nombre,
					'Recibo enviado',
				);
			} else {
				throw new Error();
			}
		} catch (error) {
			if (error instanceof Error)
				notifyError(
					'Error al enviar el recibo\n' + error.message + ': ' + error.stack,
					'Error',
				);
			console.log(error);
		} finally {
			setIsSending(false);
		}
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
				Historial de Pagos
			</Typography>

			{loading ? (
				<Box sx={{ textAlign: 'center', py: 2 }}>Cargando...</Box>
			) : (
				<PaymentsTable
					payments={client?.pagosTabla || []}
					isLoading={loading}
					onSendPayment={handleSendPayment}
					isSending={isSending}
				/>
			)}
		</Box>
	);
}
