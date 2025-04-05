import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Pago } from '../../../../interfaces/InterfacesClientDetails';
import ConfirmDialog from '../../../common/Confirm';
import axios from 'axios';
import { HOST_API } from '../../../../../vite-env.d';
import { queryClient } from '../../../../query-client';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../../context/NotificationContext';

interface PaymentDetailsProps {
	payment: Pago;
	onClose?: () => void;
}

// Función auxiliar para formatear fechas
const formatDate = (dateString: string) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleString('es-VE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
	const { id: clientId } = useParams();
	const queryKeys = [
		'clientsPieChart',
		`client-${clientId}`,
		'clients-',
		'paysBarChart0',
		'lastPays',
	];
	const { notifyError, notifySuccess } = useNotification();

	const handleAnular = async () => {
		try {
			await axios.patch(HOST_API + '/paysClient0/' + payment._id, {
				estado: 'Anulado',
			});

			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
			notifySuccess('El pago se ha anulado correctamente', 'Pago anulado');
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al anular el pago');
			}
		}
	};
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [canceling, setCanceling] = useState<boolean>(false);

	const handleConfirm = async () => {
		setCanceling(true);

		handleAnular();

		setShowConfirmation(false);
		// Cerrar el modal si existe la función closeModal
		if (onClose) {
			onClose();
		}
	};

	// Manejador para cancelar la confirmación de creación
	const handleCancelConfirmation = () => {
		setShowConfirmation(false);
	};

	// Formatear moneda
	const formatCurrency = (value: number, currency: string) => {
		if (currency === 'VES') {
			return `${value.toFixed(2)}Bs`;
		}
		return `${value.toFixed(2)}$`;
	};

	return (
		<>
			<Box sx={{ minWidth: 300, pt: 2 }}>
				<Typography variant='h6' gutterBottom>
					Detalles del Pago
				</Typography>

				{payment && (
					<>
						<Typography variant='body1' gutterBottom>
							<strong>Motivo:</strong> {payment.motivo}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Tipo de Pago:</strong> {payment.tipoPago}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Referencia:</strong> {payment.referencia}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Monto (USD):</strong> {payment.montoUSD}$
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Monto (VES):</strong>{' '}
							{formatCurrency(payment.montoVES, 'VES')}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Estado:</strong> {payment.estado}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Creado Por:</strong> {payment.creadoPor}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Recibido Por:</strong> {payment.recibidoPor}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Fecha de Creación:</strong> {formatDate(payment.fecha)}
						</Typography>
						{payment.comentario && (
							<Typography variant='body1' gutterBottom>
								<strong>Comentario:</strong> {payment.comentario}
							</Typography>
						)}
						{payment.editadoPor && payment.fechaEdicion && (
							<>
								<Typography variant='body1' gutterBottom>
									<strong>Editado Por:</strong> {payment.editadoPor}
								</Typography>
								<Typography variant='body1' gutterBottom>
									<strong>Fecha de Edición:</strong>{' '}
									{formatDate(payment.fechaEdicion)}
								</Typography>
							</>
						)}

						<Box
							sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}
						>
							{payment.estado === 'Activo' && (
								<Button
									onClick={() => setShowConfirmation(true)}
									color='error'
									variant='contained'
									disabled={canceling}
								>
									Anular
								</Button>
							)}
							<Button onClick={onClose} color='primary' variant='contained'>
								Cerrar
							</Button>
						</Box>
					</>
				)}
			</Box>

			{/* Diálogo de confirmación para anular */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar anulación'
				message='¿Está seguro que desea anular este pago?'
				confirmText='Anular'
				cancelText='Cancelar'
				confirmColor='error'
			/>
		</>
	);
};

export default PaymentDetails;
