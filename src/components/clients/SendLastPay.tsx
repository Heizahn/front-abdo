import { IconButton, Tooltip } from '@mui/material';
import { SendRounded as SendIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';
import { HOST_API } from '../../config/env';

export default function SendLastPay({ clientesId }: { clientesId: string }) {
	const [sendingLastPay, setSendingLastPay] = useState(false);
	const { notifySuccess, notifyError } = useNotification();

	const fetchLastPay = async () => {
		const { data } = await axios.get(`${HOST_API}/client/${clientesId}/lastPay`);

		return data[0].id;
	};

	const handleSendLastPay = async () => {
		setSendingLastPay(true);
		try {
			const lastPay = await fetchLastPay();

			if (!lastPay) {
				notifyError('No se encontró el ultimo pago', 'Error');
				return;
			}

			await axios.get(`${HOST_API}/send-pay/${lastPay}`);

			notifySuccess('El ultimo pago se ha enviado correctamente', 'Ultimo pago enviado');
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al enviar el ultimo pago');
			}
		} finally {
			setSendingLastPay(false);
		}
	};
	return (
		<Tooltip title='Enviar ultimo pago'>
			<IconButton
				size='medium'
				color='primary'
				onClick={handleSendLastPay}
				disabled={sendingLastPay}
				sx={{
					padding: 0,
				}}
			>
				<SendIcon fontSize='medium' color={sendingLastPay ? 'disabled' : 'primary'} />
			</IconButton>
		</Tooltip>
	);
}
