import { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	Grid,
	Chip,
	Avatar,
	Button,
	CircularProgress,
	Link,
} from '@mui/material';
import {
	Person as PersonIcon,
	Phone as PhoneIcon,
	Home as HomeIcon,
	Router as RouterIcon,
	MonetizationOn as MoneyIcon,
	Assignment as DocumentIcon,
	Send as SendIcon,
	CalendarMonth,
} from '@mui/icons-material';
import axios from 'axios';
import Pay from '../../common/Pay';
import { useClientList } from '../../../hooks/useClientList';
import PaymentHistory from './paymentHistory';
import { CLIENTS } from '../../../config/clients';
import SimpleModalWrapper from '../../common/ContainerForm';
import SuspendedClient from '../../common/SuspendedClient';
import { useNotification } from '../../../context/NotificationContext';
import { IClientPayment } from '../../../interfaces/Interfaces';
import { isValidClientList } from '../../../services/getClient';

const ClientDetail = ({ client }: { client: IClientPayment }) => {
	const [sendingPayment, setSendingPayment] = useState(false);
	const { clientList } = useClientList();
	const { notifyError } = useNotification();

	// Enviar último pago
	const handleSendLastPayment = async () => {
		if (!isValidClientList(clientList)) {
			throw new Error(`Cliente "${clientList}" no encontrado`);
		}
		try {
			setSendingPayment(true);

			const res = await axios.get(
				`${CLIENTS[clientList].url}/client/${client.id}/lastPay`,
			);

			if (res.data.length === 0) {
				notifyError('No hay pagos para enviar');
				return;
			}

			await axios.get(`${CLIENTS[clientList].url}/send-pay/${res.data[0].id}`);
		} catch (error) {
			console.error('Error enviando el comprobante:', error);
		} finally {
			setSendingPayment(false);
		}
	};

	// Función auxiliar para determinar el color del chip de saldo
	const getSaldoColor = (saldo: number) => {
		if (saldo >= 0) {
			return 'success';
		} else {
			return 'error';
		}
	};

	if (!isValidClientList(clientList)) {
		throw new Error(`Cliente "${clientList}" no encontrado`);
	}

	return (
		<>
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
								<PersonIcon />
							</Avatar>
							<Typography variant='h5' component='div'>
								{client.nombre}
							</Typography>
						</Box>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}
						>
							<Chip
								label={client.estado}
								color={
									client.estado === 'Activo'
										? 'success'
										: client.estado === 'Suspendido'
										? 'warning'
										: 'error'
								}
							/>
							<SuspendedClient
								clientId={client.id}
								clientStatus={client.estado}
							/>
						</Box>
					</Box>

					<Divider sx={{ mb: 2 }} />

					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<DocumentIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Identificación:</strong> {client.identificacion}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<CalendarMonth
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Fecha Corte:</strong> {client.fechaCorte}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<PhoneIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Teléfono:</strong> {client.telefonos || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>Plan:</strong> {client.plan || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<HomeIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Dirección:</strong> {client.direccion || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>Sector:</strong> {client.sector || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<RouterIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Router:</strong> {client.router || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>IPV4:</strong>{' '}
								{(client.ipv4 && (
									<Link href={`http://${client.ipv4}`} target='_blank'>
										{client.ipv4}
									</Link>
								)) ||
									'No asignada'}
							</Typography>
						</Grid>
					</Grid>

					<Box
						sx={{
							mt: 3,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							flexWrap: 'wrap',
							gap: 1,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}
						>
							<Chip
								icon={<MoneyIcon />}
								label={`Saldo: ${(client.saldo || 0).toFixed(2)} USD`}
								color={getSaldoColor(client.saldo)}
								variant='outlined'
							/>
						</Box>
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								justifyContent: 'flex-end',
							}}
						>
							<SimpleModalWrapper
								triggerButtonText='Registrar Pago'
								triggerButtonColor='primary'
								showCloseButton={false}
							>
								<Pay
									clientName={client.nombre}
									clientesId={client.id}
									onCancel={() => {}}
									url={CLIENTS[clientList].url}
								/>
							</SimpleModalWrapper>

							<Button
								variant='outlined'
								color='primary'
								startIcon={<SendIcon />}
								onClick={handleSendLastPayment}
								disabled={sendingPayment}
							>
								{sendingPayment ? (
									<CircularProgress size={24} />
								) : (
									'Enviar último pago'
								)}
							</Button>
						</Box>
					</Box>
				</CardContent>

				{/* Componente de Historial de Pagos */}
				<PaymentHistory pagos={client.ultimosPagos} />
			</Card>
		</>
	);
};

export default ClientDetail;
