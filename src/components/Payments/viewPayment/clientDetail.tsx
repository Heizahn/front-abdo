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
	PersonRounded as PersonIcon,
	PhoneRounded as PhoneIcon,
	HomeRounded as HomeIcon,
	MonetizationOnRounded as MoneyIcon,
	AssignmentRounded as DocumentIcon,
	SendRounded as SendIcon,
	CalendarMonthRounded as CalendarMonth,
} from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import Pay from '../../common/Pay';
import PaymentHistory from './paymentHistory';
import SimpleModalWrapper from '../../common/ContainerForm';
import SuspendedClient from '../../common/SuspendedClient';
import { useNotification } from '../../../context/NotificationContext';
import { IClientPayment } from '../../../interfaces/Interfaces';
import { HOST_API } from '../../../config/env';
import Navigation from '../../common/Navigation';
import LastInvoices from './lastInvoices';
import CreateInvoice from '../../clientDetail/client/Invoices/CreateInvoice';
import { getClient } from '../../../services/getClient';

const ClientDetail = ({
	client,
	buildParams,
	refetchSearch,
}: {
	client: IClientPayment;
	buildParams: string;
	refetchSearch: (clients: IClientPayment[]) => void;
}) => {
	const [sendingPayment, setSendingPayment] = useState(false);
	const [activeTab, setActiveTab] = useState('payments');
	const { notifyError } = useNotification();

	const tabs = [
		{ label: 'Últimos Pagos', value: 'payments' },
		{ label: 'Últimas Facturas', value: 'invoices' },
	];

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};
	const renderTabContent = () => {
		switch (activeTab) {
			case 'payments':
				return <PaymentHistory pagos={client.ultimosPagos} />;
			case 'invoices':
				return <LastInvoices invoices={client.ultimasFacturas} />;
			default:
				return <PaymentHistory pagos={client.ultimosPagos} />;
		}
	};

	// Enviar último pago
	const handleSendLastPayment = async () => {
		try {
			setSendingPayment(true);

			const res = await axios.get(`${HOST_API}/client/${client.id}/lastPay`);

			if (res.data.length === 0) {
				notifyError('No hay pagos para enviar');
				return;
			}

			await axios.get(`${HOST_API}/send-pay/${res.data[0].id}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				notifyError(error.message, 'Error');
			} else if (error instanceof Error) {
				notifyError(error.message, 'Error');
			} else {
				notifyError('Error enviando el comprobante\nerror desconocido', 'Error');
			}
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

	return (
		<>
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 1,
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Avatar
								sx={{
									bgcolor: `${
										client.sState === 'Activo' && client.nBalance >= 0
											? 'success.main'
											: client.sState === 'Suspendido'
											? 'error.main'
											: 'warning.main'
									}`,
									mr: 2,
								}}
							>
								<PersonIcon />
							</Avatar>
							<Typography variant='h5' component='div'>
								{client.sName}
							</Typography>
						</Box>

						<SuspendedClient
							clientId={client.id}
							clientStatus={client.sState}
							isButton={true}
						/>
					</Box>

					<Divider sx={{ mb: 2 }} />

					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<DocumentIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Identificación:</strong> {client.sDni}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>IPV4:</strong>{' '}
								{(client.sIp && (
									<Link href={`http://${client.sIp}`} target='_blank'>
										{client.sIp}
									</Link>
								)) ||
									'No asignada'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<PhoneIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Teléfono:</strong> {client.sPhone || 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>Plan:</strong>{' '}
								{client.plan && client.nMBPS
									? `${client.plan} (${client.nMBPS} MBPS)`
									: 'No asignado'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<HomeIcon
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								{client.sGps ? (
									<>
										<strong>Dirección:</strong>{' '}
										<Link
											href={`https://maps.google.com/?q=${client.sGps}`}
											target='_blank'
										>
											{client.sAddress || 'No asignado'}
										</Link>
									</>
								) : (
									<>
										<strong>Dirección:</strong>{' '}
										{client.sAddress || 'No asignado'}
									</>
								)}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<strong>Sector:</strong> {client.sector || 'No asignado'}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' color='text.secondary'>
								<CalendarMonth
									fontSize='small'
									sx={{ mr: 1, verticalAlign: 'middle' }}
								/>
								<strong>Fecha Corte:</strong> {client.nPayment}
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
								label={`Saldo: ${(client.nBalance || 0).toFixed(2)} USD`}
								color={getSaldoColor(client.nBalance)}
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
								triggerButtonText='Crear Factura'
								triggerButtonColor='primary'
								showCloseButton={false}
							>
								<CreateInvoice
									clientId={client.id}
									onCancel={() => {}}
									onInvoiceSuccess={async () => {
										const identification = client.sDni || client.sRif;
										const res = await getClient(
											identification!,
											buildParams,
										);
										refetchSearch(res);
									}}
								/>
							</SimpleModalWrapper>
							<SimpleModalWrapper
								triggerButtonText='Registrar Pago'
								triggerButtonColor='primary'
								showCloseButton={false}
							>
								<Pay
									clientName={client.sName}
									clientId={client.id}
									onCancel={() => {}}
									onPaymentSuccess={async () => {
										const identification = client.sDni || client.sRif;
										const res = await getClient(
											identification!,
											buildParams,
										);
										refetchSearch(res);
									}}
								/>
							</SimpleModalWrapper>

							<Button
								variant='outlined'
								color='primary'
								startIcon={<SendIcon />}
								onClick={handleSendLastPayment}
								disabled={sendingPayment || true}
							>
								{sendingPayment ? (
									<CircularProgress size={24} />
								) : (
									'Enviar último pago'
								)}
							</Button>
						</Box>
					</Box>

					<Navigation
						activeTab={activeTab}
						onTabChange={handleTabChange}
						tabs={tabs}
					/>
				</CardContent>

				{renderTabContent()}
			</Card>
		</>
	);
};

export default ClientDetail;
