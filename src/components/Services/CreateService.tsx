import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import ConfirmDialog from '../common/Confirm'; // Adjust path as needed
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useMutateDate } from '../../hooks/useQuery';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';

// Define the interface for the service form data
interface ServiceFormData {
	sName: string;
	nAmount: number;
	nMBPS: number;
}

// Define the data transfer object for the API
interface ServiceDataDTO extends ServiceFormData {
	sState: string;
	idCreator: string;
	dCreation: string;
}

// Initial form values
const valueInitial: ServiceFormData = {
	sName: '',
	nAmount: 0,
	nMBPS: 0,
};

// Validation schema using Yup
const validationSchema = yup.object({
	sName: yup.string().required('El nombre es obligatorio'),
	nAmount: yup
		.number()
		.typeError('El costo debe ser un número')
		.positive('El costo debe ser mayor que 0')
		.required('El costo es obligatorio'),
	nMBPS: yup
		.number()
		.typeError('La velocidad debe ser un número')
		.positive('La velocidad debe ser mayor que 0')
		.required('La velocidad es obligatoria'),
});

interface CreateServiceFormProps {
	closeModal?: () => void;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ closeModal }) => {
	const [formData, setFormData] = useState<ServiceFormData>(valueInitial);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isValid, setIsValid] = useState<boolean>(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);

	const { user } = useAuth();
	const { notifySuccess, notifyError } = useNotification();

	// Define query keys to invalidate after successful creation
	const queryKeys = ['plans'];

	// Mutation for creating service
	const mutation = useMutateDate<ServiceDataDTO, ServiceDataDTO>('/plans', {
		onSuccess: () => {
			notifySuccess(
				'El servicio se ha creado correctamente en el sistema',
				'Servicio creado',
			);
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
			if (closeModal) {
				closeModal();
			}
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al crear el servicio');
			}
		},
	});

	// Validate form whenever formData changes
	useEffect(() => {
		const validateForm = async () => {
			try {
				await validationSchema.validate(formData, { abortEarly: false });
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

		// Determine if form has changes
		const hasAnyChanges = Object.keys(formData).some(
			(key) =>
				formData[key as keyof ServiceFormData] !==
				valueInitial[key as keyof ServiceFormData],
		);

		setHasChanges(hasAnyChanges);
	}, [formData]);

	// Handle input changes
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setAttemptedSubmit(true);

		try {
			await validationSchema.validate(formData, { abortEarly: false });
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

	// Handle confirmation of service creation
	const handleConfirm = async () => {
		setShowConfirmation(false);

		if (user) {
			const serviceData: ServiceDataDTO = {
				sName: formData.sName,
				nAmount: Number(formData.nAmount),
				nMBPS: Number(formData.nMBPS),
				sState: 'Activo',
				idCreator: user.id,
				dCreation: new Date().toISOString(),
			};

			await mutation.mutateAsync(serviceData);

			// Reset form state
			setFormData(valueInitial);
			setAttemptedSubmit(false);
		} else {
			notifyError('Usuario no autenticado', 'Error de autenticación');
		}
	};

	// Handle cancel confirmation
	const handleCancelConfirmation = () => {
		setShowConfirmation(false);
	};

	// Handle cancel button click
	const handleCancel = () => {
		if (hasChanges) {
			setShowCancelConfirmation(true);
		} else {
			if (closeModal) {
				closeModal();
			}
		}
	};

	// Handle confirmation of cancel
	const handleConfirmCancel = () => {
		setShowCancelConfirmation(false);
		setFormData(valueInitial);
		setAttemptedSubmit(false);
		if (closeModal) {
			closeModal();
		}
	};

	// Handle cancellation of cancel
	const handleCancelCancelConfirmation = () => {
		setShowCancelConfirmation(false);
	};

	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h5' gutterBottom>
					Crear Servicio
				</Typography>

				<TextField
					required
					fullWidth
					id='sName'
					label='Nombre'
					name='sName'
					value={formData.sName}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.sName)}
					helperText={attemptedSubmit && errors.sName}
					size='small'
				/>

				<TextField
					required
					fullWidth
					id='nAmount'
					label='Costo (USD)'
					name='nAmount'
					value={formData.nAmount}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.nAmount)}
					helperText={attemptedSubmit && errors.nAmount}
					size='small'
					inputProps={{
						inputMode: 'decimal',
					}}
				/>

				<TextField
					required
					fullWidth
					id='nMBPS'
					label='Velocidad (Mbps)'
					name='nMBPS'
					value={formData.nMBPS}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.nMBPS)}
					helperText={attemptedSubmit && errors.nMBPS}
					size='small'
				/>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
					<Button variant='outlined' color='secondary' onClick={handleCancel}>
						Cancelar
					</Button>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						disabled={!isValid || !hasChanges || mutation.isPending}
					>
						{mutation.isPending ? 'Guardando...' : 'Guardar'}
					</Button>
				</Box>
			</Box>

			{/* Confirmation dialog for creating service */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar creación'
				message='¿Está seguro que desea crear este servicio con los datos ingresados?'
				confirmText='Guardar'
				cancelText='Cancelar'
			/>

			{/* Confirmation dialog for canceling */}
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
};

export default CreateServiceForm;
