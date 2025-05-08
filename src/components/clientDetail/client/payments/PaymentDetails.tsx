import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Pago } from '../../../../interfaces/InterfacesClientDetails';
import ConfirmDialog from '../../../common/Confirm';
import axios from 'axios';
import { HOST_API } from '../../../../config/env';
import { queryClient } from '../../../../query-client';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../../context/NotificationContext';
import { ROLES, useAuth } from '../../../../context/AuthContext';
import { Client } from '../../../../interfaces/Interfaces';
import { formatDate } from '../../../../services/formaterDate';

interface PaymentDetailsProps {
	payment: Pago;
	onClose?: () => void;
	client?: Client;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose, client }) => {
	const { id: clientId } = useParams();
	const queryKeys = [
		'clientsPieChart',
		`client-${clientId}`,
		'clients',
		`paysPieChart0-${clientId}`,
		`payments-${clientId}`,
		`invoices-${clientId}`,
		`invoice-list-${clientId}`,
		'lastPays',
	];
	const { user } = useAuth();
	const { notifyError, notifySuccess } = useNotification();

	const handleAnular = async () => {
		try {
			await axios.put(HOST_API + '/payments/' + payment.id + '/cancel', {
				idEditor: user?.id,
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
				console.log(error);
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

	return (
		<>
			<Box sx={{ minWidth: 300, pt: 2 }}>
				<Typography variant='h6' gutterBottom>
					Detalles del Pago
				</Typography>

				{payment && (
					<>
						<Typography variant='body1' gutterBottom>
							{payment.sReason ? (
								<>
									<strong>Motivo:</strong> {payment.sReason}
								</>
							) : (
								client && (
									<>
										<strong>Cliente:</strong> {client.sName}
									</>
								)
							)}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Tipo de Pago:</strong>{' '}
							{payment.bCash ? 'Efectivo' : 'Digital'}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Referencia:</strong> {payment.sReference}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Monto (USD):</strong> {payment.nAmount}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Monto (VES):</strong> {payment.nBs}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Estado:</strong> {payment.sState}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Creado Por:</strong> {payment.creator?.toUpperCase()}
						</Typography>
						{/* <Typography variant='body1' gutterBottom>
							<strong>Recibido Por:</strong> {payment.recibidoPor}
						</Typography> */}
						<Typography variant='body1' gutterBottom>
							<strong>Fecha de Creación:</strong> {formatDate(payment.dCreation)}
						</Typography>
						{payment.sCommentary && (
							<Typography variant='body1' gutterBottom>
								<strong>Comentario:</strong> {payment.sCommentary}
							</Typography>
						)}
						{payment.editor && payment.dEdition && (
							<>
								<Typography variant='body1' gutterBottom>
									<strong>Editado Por:</strong>{' '}
									{payment.editor?.toUpperCase()}
								</Typography>
								<Typography variant='body1' gutterBottom>
									<strong>Fecha de Edición:</strong>{' '}
									{formatDate(payment.dEdition)}
								</Typography>
							</>
						)}

						<Box
							sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}
						>
							{payment.sState === 'Activo' &&
								user?.nRole !== ROLES.PAYMENT_USER && (
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
