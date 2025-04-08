import {
	Autocomplete,
	Box,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import { useFetchData, useMutateDate } from '../../hooks/useQuery';
import ConfirmDialog from '../common/Confirm';
import { getBsToUsd, getUsdToBs } from '../../services/BCBService';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { validationSchema, valueInitial } from '../common/validatePay';
import * as yup from 'yup';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { PaymentDataForm, PaymentDTO } from '../../interfaces/types';
import { queryClient } from '../../query-client';
import { ClientViewPayment } from '../../interfaces/Interfaces';
import { useAuth } from '../../context/AuthContext';

export default function Create() {
	const { user } = useAuth();
	const [paymentData, setPaymentData] = useState<PaymentDataForm>(valueInitial);
	const [sendingPayment, setSendingPayment] = useState(false);
	const [loadingBsToUsd, setLoadingBsToUsd] = useState(false);
	const [loadingUsdToBs, setLoadingUsdToBs] = useState(false);
	const [clientesId, setClientesId] = useState<string>('');

	const [isValid, setIsValid] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const { notifyError, notifySuccess } = useNotification();

	const { refetchClients } = useClients();
	const { data } = useFetchData<[]>('/clientsList', 'clientsList');

	const queryKeys = [
		'clientsStats',
		'clientsPieChart',
		'paysBarChart0',
		'lastPays',
		'paysPieChart0-' + clientesId,
		`client-${clientesId}`,
		'clientsList',
		'clients-',
		'paysListSimple',
		'paysList',
	];

	const mutation = useMutateDate<PaymentDTO, PaymentDTO>(`/paysClient0`, {
		onSuccess: () => {
			notifySuccess('El pago se ha creado correctamente', 'Pago creado');
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al crear el pago');
			}
		},
	});

	useEffect(() => {
		const validateForm = async () => {
			try {
				await validationSchema.validate(paymentData, { abortEarly: false });

				if (clientesId) {
					setIsValid(true);
				}
			} catch (error) {
				if (error instanceof yup.ValidationError) {
					const newErrors: { [key: string]: string } = {};
					error.inner.forEach((err) => {
						if (err.path) {
							newErrors[err.path] = err.message;
						}
					});

					setIsValid(false);
				}
			}
		};

		validateForm();

		const initialFormData: PaymentDataForm = valueInitial;

		const hasAnyChanges = Object.keys(paymentData).some(
			(key) =>
				paymentData[key as keyof PaymentDataForm] !==
				initialFormData[key as keyof PaymentDataForm],
		);

		setHasChanges(hasAnyChanges);
	}, [paymentData, clientesId]);

	const handleClear = () => {
		setPaymentData(valueInitial);
		setClientesId('');
	};

	const handleGetBsToUsd = async () => {
		try {
			setLoadingBsToUsd(true);
			const { montoBs } = paymentData;
			const montoUsd = await getBsToUsd(Number(montoBs));
			setPaymentData({
				...paymentData,
				montoRef: Number(montoUsd),
			});
		} catch (error) {
			console.error('Error al convertir Bs a USD:', error);
		} finally {
			setLoadingBsToUsd(false);
		}
	};

	const handleGetUsdToBs = async () => {
		try {
			setLoadingUsdToBs(true);
			const { montoRef } = paymentData;
			const montoBs = await getUsdToBs(Number(montoRef));
			setPaymentData({
				...paymentData,
				montoBs: Number(montoBs),
			});
		} catch (error) {
			console.error('Error al convertir USD a Bs:', error);
		} finally {
			setLoadingUsdToBs(false);
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPaymentData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent) => {
		const { name, value } = e.target;

		setPaymentData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validationSchema.validate(paymentData, { abortEarly: false });
			setShowConfirmation(true);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const newErrors: { [key: string]: string } = {};
				error.inner.forEach((err) => {
					if (err.path) {
						newErrors[err.path] = err.message;
					}
				});
			}
		}
	};

	const handleConfirm = async () => {
		setSendingPayment(true);

		const Payment: PaymentDTO = {
			monto: Number(paymentData.montoRef),
			fecha: new Date().toISOString(),
			creadoPor: user?.id as string,
			estado: 'Activo',
			tipo: paymentData.tipoMoneda === 'USD' ? 1 : 2,
			recibidoPor: paymentData.reciboPor,
			tasa: Number(paymentData.montoBs),
			tipoPago: paymentData.tipoPago,
			clientesId,
			referencia: paymentData.referencia,
		};

		if (paymentData.comentario) {
			Payment.comentario = paymentData.comentario;
		}
		await mutation.mutateAsync(Payment);
		refetchClients();

		setShowConfirmation(false);

		handleClear();
	};

	const handleCancelConfirmation = () => {
		setShowConfirmation(false);
	};

	const { data: profiles } = useFetchData<[{ id: string; username: string }]>(
		'/users',
		'profiles',
	);

	return (
		<Container sx={{ p: 3 }}>
			<>
				<Box component='form' onSubmit={handleFormSubmit} noValidate sx={{ mt: 2 }}>
					<Grid item xs={12}>
						<FormControl fullWidth margin='dense' required>
							<Autocomplete
								id='client-select'
								options={data || []}
								getOptionLabel={(option: ClientViewPayment) =>
									`${option.nombre} ${option.identificacion}, deuda: ${option.deuda}`
								}
								value={
									data?.find(
										(client: ClientViewPayment) =>
											client._id === clientesId,
									) || null
								}
								onChange={(_, newValue) => {
									setClientesId(newValue ? newValue._id : '');
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label='Seleccionar Cliente'
										required
									/>
								)}
								isOptionEqualToValue={(option, value) =>
									option._id === value._id
								}
							/>
						</FormControl>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl fullWidth required margin='dense'>
								<FormLabel component='legend'>Tipo de Moneda</FormLabel>
								<RadioGroup
									row
									name='tipoMoneda'
									value={paymentData.tipoMoneda}
									onChange={handleChange}
									sx={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr',
									}}
								>
									<FormControlLabel
										value='USD'
										control={<Radio />}
										label='Dólares'
									/>
									<FormControlLabel
										value='VES'
										control={<Radio />}
										label='Bolívares'
									/>
								</RadioGroup>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Button
								variant='contained'
								color='primary'
								fullWidth
								disabled={
									sendingPayment ||
									!paymentData.montoBs ||
									Boolean(paymentData.montoRef) ||
									loadingBsToUsd
								}
								onClick={handleGetBsToUsd}
							>
								Obtener monto en USD
							</Button>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Button
								variant='contained'
								color='primary'
								fullWidth
								disabled={
									sendingPayment ||
									!paymentData.montoRef ||
									Boolean(paymentData.montoBs) ||
									loadingUsdToBs
								}
								onClick={handleGetUsdToBs}
							>
								Obtener monto en Bs
							</Button>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								autoFocus
								margin='dense'
								id='montoRef'
								name='montoRef'
								label='Monto (USD)'
								type='number'
								fullWidth
								value={paymentData.montoRef}
								onInput={(e: ChangeEvent<HTMLInputElement>) => {
									const { value } = e.target;
									if (value.startsWith('0')) {
										e.target.value = value.replace('0', '');
									}
								}}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								autoFocus
								margin='dense'
								id='montoBs'
								name='montoBs'
								label='Monto (Bs)'
								type='number'
								fullWidth
								value={paymentData.montoBs}
								onInput={(e: ChangeEvent<HTMLInputElement>) => {
									const { value } = e.target;
									if (value.startsWith('0')) {
										e.target.value = value.replace('0', '');
									}
								}}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin='dense' required>
								<InputLabel id='tipo-pago-label'>Tipo de pago</InputLabel>
								<Select
									labelId='tipo-pago-label'
									id='tipoPago'
									name='tipoPago'
									value={paymentData.tipoPago}
									label='Tipo de pago'
									onChange={handleSelectChange}
									required
								>
									<MenuItem value='Efectivo'>Efectivo</MenuItem>
									<MenuItem value='Digital'>Digital</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin='dense' required>
								<InputLabel id='recibo-por-label'>Recibo por</InputLabel>
								<Select
									labelId='recibo-por-label'
									id='reciboPor'
									name='reciboPor'
									value={
										!paymentData.reciboPor
											? user?.id
											: paymentData.reciboPor
									}
									label='Recibo por'
									onChange={handleSelectChange}
									required
								>
									{profiles &&
										profiles.map((profile) => (
											<MenuItem key={profile.id} value={profile.id}>
												{profile.username}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<TextField
								margin='dense'
								id='referencia'
								name='referencia'
								label='Referencia'
								type='text'
								fullWidth
								value={paymentData.referencia}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								margin='dense'
								id='comentario'
								name='comentario'
								label='Comentario'
								type='text'
								fullWidth
								multiline
								rows={3}
								value={paymentData.comentario}
								onChange={handleChange}
								variant='outlined'
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
						>
							<Button variant='outlined' color='info' onClick={handleClear}>
								Limpiar
							</Button>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								disabled={!isValid || !hasChanges}
							>
								Crear
							</Button>
						</Grid>
					</Grid>
				</Box>
				{/* Diálogo de confirmación para crear */}
				<ConfirmDialog
					open={showConfirmation}
					onClose={handleCancelConfirmation}
					onConfirm={handleConfirm}
					title='Confirmar creación'
					message='¿Está seguro que desea crear este pago con los datos ingresados?'
					confirmText='Crear'
					cancelText='Cancelar'
				/>
			</>
		</Container>
	);
}
