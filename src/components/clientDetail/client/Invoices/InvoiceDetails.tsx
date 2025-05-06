import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Factura } from '../../../../interfaces/InterfacesClientDetails';
import ConfirmDialog from '../../../common/Confirm';
import axios from 'axios';
import { HOST_API } from '../../../../config/env';
import { queryClient } from '../../../../query-client';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../../context/NotificationContext';
import { useAuth } from '../../../../context/AuthContext';
interface InvoiceDetailsProps {
	invoice: Factura;
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

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose }) => {
	const { id: clientId } = useParams();
	const { user } = useAuth();
	const queryKeys = [
		'clientsPieChart',
		`client-${clientId}`,
		'all-clients',
		'invoices-' + clientId,
	];
	const { notifyError, notifySuccess } = useNotification();

	const handleAnular = async () => {
		try {
			await axios.patch(HOST_API + '/debts/' + invoice.id, {
				sState: 'Anulado',
				idEditor: user?.id,
				dEdition: new Date().toISOString(),
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
	return (
		<>
			<Box sx={{ minWidth: 300, pt: 2 }}>
				<Typography variant='h6' gutterBottom>
					Detalles de la Cuenta por Cobrar
				</Typography>

				{invoice && (
					<>
						<Typography variant='body1' gutterBottom>
							<strong>Motivo:</strong> {invoice.sReason}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Monto:</strong> {invoice.nAmount}
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Deuda:</strong>{' '}
							<span style={{ color: invoice.debt > 0 ? '#d32f2f' : 'inherit' }}>
								{invoice.debt}
							</span>
						</Typography>
						<Typography variant='body1' gutterBottom>
							<strong>Estado:</strong> {invoice.sState}
						</Typography>
						{invoice.creator && (
							<Typography variant='body1' gutterBottom>
								<strong>Creado Por:</strong> {invoice.creator.toUpperCase()}
							</Typography>
						)}
						<Typography variant='body1' gutterBottom>
							<strong>Fecha de Creación:</strong> {formatDate(invoice.dCreation)}
						</Typography>
						{invoice.editor && invoice.dEdition && (
							<>
								<Typography variant='body1' gutterBottom>
									<strong>Editado Por:</strong>{' '}
									{invoice.editor.toUpperCase()}
								</Typography>
								<Typography variant='body1' gutterBottom>
									<strong>Fecha de Edición:</strong>{' '}
									{formatDate(invoice.dEdition)}
								</Typography>
							</>
						)}

						<Box
							sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}
						>
							{invoice.sState === 'Activo' && (
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
			{/* Diálogo de confirmación para crear */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar anulación'
				message='¿Está seguro que desea anular esta factura?'
				confirmText='Anular'
				cancelText='Cancelar'
				confirmColor='error'
			/>
		</>
	);
};

export default InvoiceDetails;
