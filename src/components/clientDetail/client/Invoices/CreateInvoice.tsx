import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import authService from '../../../../services/authServices';
import { useNotification } from '../../../../context/NotificationContext';
import { useMutateDate } from '../../../../hooks/useQuery';
import { queryClient } from '../../../../query-client';
import ConfirmDialog from '../../../common/Confirm';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

type CreateInvoiceFormData = {
	motivo: string;
	monto: number;
};

type CreateInvoiceDTO = CreateInvoiceFormData & {
	fechaFacturacion: string;
	creadoPor: string;
	estado: string;
	clientesId: string;
};

const validationSchema = yup.object({
	motivo: yup.string().required('Requerido'),
	monto: yup.number().required('Requerido'),
});

const initialValues: CreateInvoiceFormData = {
	motivo: '',
	monto: 0,
};

export default function CreateInvoice({
	clientId,
	onCancel,
	closeModal,
}: {
	clientId: string;
	onCancel: () => void;
	closeModal?: () => void;
}) {
	const [invoiceData, setInvoiceData] = useState(initialValues);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [sendingInvoice, setSendingInvoice] = useState(false);
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

	const queryKeys = ['clientsPieChart', `client-${clientId}`, `clients-`];

	const mutation = useMutateDate<CreateInvoiceDTO, CreateInvoiceDTO>(`/billsClient0`, {
		onSuccess: () => {
			notifySuccess('El factura se ha creado correctamente', 'Factura creada');
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al crear el factura');
			}
		},
	});
	useEffect(() => {
		const validateForm = async () => {
			try {
				await validationSchema.validate(invoiceData, { abortEarly: false });
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
		const initialFormData: CreateInvoiceFormData = initialValues;

		const hasAnyChanges = Object.keys(invoiceData).some(
			(key) =>
				invoiceData[key as keyof CreateInvoiceFormData] !==
				initialFormData[key as keyof CreateInvoiceFormData],
		);

		setHasChanges(hasAnyChanges);
	}, [invoiceData]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setInvoiceData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setAttemptedSubmit(true);

		try {
			await validationSchema.validate(invoiceData, { abortEarly: false });
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

	const handleConfirm = async () => {
		setSendingInvoice(true);

		const Invoice: CreateInvoiceDTO = {
			motivo: invoiceData.motivo,
			monto: Number(invoiceData.monto),
			creadoPor: (await authService.profile()).id,
			estado: 'Activo',
			clientesId: clientId,
			fechaFacturacion: new Date().toISOString(),
		};

		await mutation.mutateAsync(Invoice);

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

	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h5' component='h2' gutterBottom>
					Crear Cuenta por cobrar
				</Typography>

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							margin='dense'
							id='motivo'
							name='motivo'
							label='Motivo'
							type='text'
							fullWidth
							value={invoiceData.motivo}
							onChange={handleChange}
							variant='outlined'
							error={Boolean(attemptedSubmit && errors.motivo)}
							helperText={attemptedSubmit && errors.motivo}
							required
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							margin='dense'
							id='monto'
							name='monto'
							label='Monto'
							type='number'
							fullWidth
							value={invoiceData.monto}
							onInput={(e: ChangeEvent<HTMLInputElement>) => {
								const { value } = e.target;
								if (value.startsWith('0')) {
									e.target.value = value.replace('0', '');
								}
							}}
							onChange={handleChange}
							variant='outlined'
							error={Boolean(attemptedSubmit && errors.monto)}
							helperText={attemptedSubmit && errors.monto}
							required
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
							disabled={!isValid || !hasChanges || sendingInvoice}
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
				message='¿Está seguro que desea crear esta factura con los datos ingresados?'
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
