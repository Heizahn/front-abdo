import { IconButton, Tooltip } from '@mui/material';
import { SendRounded as SendIcon } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../../context/NotificationContext';
import { HOST_API } from '../../../../config/env';
import { useClientDetailsContext } from '../../../../context/ClientDetailContext';

export default function SendPay({ paymentId }: { paymentId: string }) {
	const [isSending, setIsSending] = useState(false);
	const { client } = useClientDetailsContext();

	const { notifyError, notifySuccess, notifyInfo } = useNotification();

	const handleSendPayment = async () => {
		setIsSending(true);
		notifyInfo('Enviando pago a ' + client?.nombre);
		try {
			console.log(paymentId);
			const { data } = await axios.get(HOST_API + '/send-pay/' + paymentId);

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
		<Tooltip title='Enviar Pago'>
			<IconButton
				color='primary'
				onClick={handleSendPayment}
				size='small'
				disabled={isSending}
			>
				<SendIcon />
			</IconButton>
		</Tooltip>
	);
}
