import {
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	CircularProgress,
	SelectChangeEvent,
	Box,
	Typography,
	FormHelperText,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { getBsToUsd, getUsdToBs } from '../../services/BCBService';
import { Invoice, PaymentDataForm, PaymentDTO } from '../../interfaces/types';
import { useFetchData, useMutateDate } from '../../hooks/useQuery';
import { validationSchema, valueInitial } from './validatePay';
import * as yup from 'yup';
import ConfirmDialog from './Confirm';
import { useNotification } from '../../context/NotificationContext';
import { useClients } from '../../context/ClientsContext';
import { queryClient } from '../../query-client';
import { useAuth } from '../../context/AuthContext';

export default function Pay({
	clientesId,
	clientName,
	onCancel,
	closeModal,
}: {
	clientesId: string;
	clientName: string;
	onCancel: () => void;
	closeModal?: () => void;
}) {
	const { user } = useAuth();
	const [paymentData, setPaymentData] = useState<PaymentDataForm>(valueInitial);
	const [sendingPayment, setSendingPayment] = useState(false);
	const [loadingBsToUsd, setLoadingBsToUsd] = useState(false);
	const [loadingUsdToBs, setLoadingUsdToBs] = useState(false);

	// Estado para los errores de validación
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	// Estado para controlar si el formulario es válido
	const [isValid, setIsValid] = useState<boolean>(false);
	// Estado para controlar si se ha intentado enviar el formulario
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
	// Estado para controlar el diálogo de confirmación
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	// Estado para manejar cambios pendientes (para el botón cancelar)
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	// Estado para el diálogo de confirmación de cancelar
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);
	const { notifyError, notifySuccess } = useNotification();
	const { refetchClients } = useClients();

	const queryKeys = [
		'clientsStats',
		'clientsPieChart',
		'paysBarChart0',
		'lastPays',
		'paysPieChart0-' + clientesId,
		`client-${clientesId}`,
		'clientsList',
		'paysListSimple',
		'paysList',
	];

	const mutationWithInvoice = useMutateDate<PaymentDTO, PaymentDTO>(
		`/paysClient0/factura/${paymentData.facturaId}`,
		{
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
		},
	);

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
				setErrors({});
				setIsValid(true);
			} catch (error) {
				if (error instanceof yup.ValidationError) {
					const newErrors: { [key: string]: string } = {};
					error.inner.forEach((err) => {
						if (err.path) {
							newErrors[err.path] = err.message;
						}
					});
					setErrors(newErrors);
					setIsValid(false);
				}
			}
		};

		validateForm();

		// Determinar si hay cambios en el formulario
		const initialFormData: PaymentDataForm = valueInitial;

		const hasAnyChanges = Object.keys(paymentData).some(
			(key) =>
				paymentData[key as keyof PaymentDataForm] !==
				initialFormData[key as keyof PaymentDataForm],
		);

		setHasChanges(hasAnyChanges);
	}, [paymentData]);

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
		setAttemptedSubmit(true);

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
				setErrors(newErrors);
			}
		}
	};

	// Manejador para confirmar la acción de creación
	const handleConfirm = async () => {
		setSendingPayment(true);
		if (paymentData.facturaId) {
			const Payment: PaymentDTO = {
				monto: Number(paymentData.montoRef),
				fecha: new Date().toISOString(),
				creadoPor: user?.id as string,
				estado: 'Activo',
				recibidoPor: paymentData.reciboPor,
				tasa: Number(paymentData.montoBs),
				tipoPago: paymentData.tipoPago,
				tipo: paymentData.tipoMoneda === 'USD' ? 1 : 2,
				clientesId,
				referencia: paymentData.referencia,
			};

			if (paymentData.comentario) {
				Payment.comentario = paymentData.comentario;
			}
			await mutationWithInvoice.mutateAsync(Payment);
			refetchClients();
		} else {
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
		}
		setShowConfirmation(false);
		// Cerrar el modal si existe la función closeModal
		if (closeModal) {
			closeModal();
		}
	};

	// Manejador para cancelar la confirmación de creación
	const handleCancelConfirmation = () => {
		setShowConfirmation(false);
	};

	// Manejador para confirmar la cancelación del formulario
	const handleConfirmCancel = () => {
		setShowCancelConfirmation(false);
		onCancel();
		// Cerrar el modal si existe la función closeModal
		if (closeModal) {
			closeModal();
		}
	};

	// Manejador para cancelar la cancelación del formulario
	const handleCancelCancelConfirmation = () => {
		setShowCancelConfirmation(false);
	};

	// Manejador para el botón cancelar - Ahora siempre puede cancelar, pero muestra confirmación si hay cambios
	const handleCancel = () => {
		if (hasChanges) {
			setShowCancelConfirmation(true);
		} else {
			onCancel();
			// Cerrar el modal si existe la función closeModal
			if (closeModal) {
				closeModal();
			}
		}
	};

	const { data: invoices, isLoading: isLoadingInvoices } = useFetchData<Invoice[]>(
		`/clients/${clientesId}/bills`,
		`invoices-${clientesId}`,
	);

	const { data: profiles } = useFetchData<[{ id: string; username: string }]>(
		'/users',
		'profiles',
	);
	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h5' component='h2' gutterBottom>
					Crear Pago para {clientName}
				</Typography>

				<Typography variant='body1' gutterBottom>
					Ingrese los detalles del pago a registrar.
				</Typography>

				<Grid container spacing={2}>
					{invoices && invoices.length > 0 && (
						<Grid item xs={12}>
							<FormControl fullWidth margin='dense'>
								<InputLabel id='factura-id-label'>Factura</InputLabel>
								<Select
									labelId='factura-id-label'
									id='facturaId'
									name='facturaId'
									value={paymentData.facturaId}
									label='Factura'
									onChange={handleSelectChange}
								>
									{isLoadingInvoices ? (
										<MenuItem value=''>
											<CircularProgress />
										</MenuItem>
									) : (
										invoices.map((invoice) => (
											<MenuItem key={invoice.id} value={invoice.id}>
												{invoice.motivo} - Deuda:{' '}
												{invoice.deuda.toFixed(2)}
											</MenuItem>
										))
									)}
								</Select>
								{attemptedSubmit && errors.facturaId && (
									<FormHelperText>{errors.facturaId}</FormHelperText>
								)}
							</FormControl>
						</Grid>
					)}

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
							{attemptedSubmit && errors.tipoMoneda && (
								<FormHelperText error>{errors.tipoMoneda}</FormHelperText>
							)}
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
							error={Boolean(attemptedSubmit && errors.montoRef)}
							helperText={attemptedSubmit && errors.montoRef}
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
							error={Boolean(attemptedSubmit && errors.montoBs)}
							helperText={attemptedSubmit && errors.montoBs}
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
							{attemptedSubmit && errors.tipoPago && (
								<FormHelperText>{errors.tipoPago}</FormHelperText>
							)}
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
									!paymentData.reciboPor ? user?.id : paymentData.reciboPor
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
							error={Boolean(attemptedSubmit && errors.referencia)}
							helperText={attemptedSubmit && errors.referencia}
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
							error={Boolean(attemptedSubmit && errors.comentario)}
							helperText={attemptedSubmit && errors.comentario}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
					>
						<Button
							variant='outlined'
							color='secondary'
							onClick={handleCancel}
							// Ahora el botón de cancelar siempre está habilitado
						>
							Cancelar
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

			{/* Diálogo de confirmación para cancelar */}
			<ConfirmDialog
				open={showCancelConfirmation}
				onClose={handleCancelCancelConfirmation}
				onConfirm={handleConfirmCancel}
				title='Confirmar cancelación'
				message='¿Está seguro que desea cancelar? Se perderán los cambios realizados.'
				confirmText='Sí, cancelar'
				cancelText='No, continuar editando'
				confirmColor='error'
			/>
		</>
	);
}
