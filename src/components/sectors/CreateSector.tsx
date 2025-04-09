import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import ConfirmDialog from '../common/Confirm'; // Adjust path as needed
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useMutateDate } from '../../hooks/useQuery';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';

// Define the interface for the sector form data
interface SectorFormData {
	nombre: string;
}

// Define the data transfer object for the API
interface SectorDataDTO {
	nombre: string;
	estado: string;
	creadoPor: string;
	fechaCreacion: string;
}

// Initial form values
const valueInitial: SectorFormData = {
	nombre: '',
};

// Validation schema using Yup
const validationSchema = yup.object({
	nombre: yup.string().required('El nombre es obligatorio'),
});

interface CreateSectorFormProps {
	closeModal?: () => void;
}

const CreateSectorForm: React.FC<CreateSectorFormProps> = ({ closeModal }) => {
	const [formData, setFormData] = useState<SectorFormData>(valueInitial);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isValid, setIsValid] = useState<boolean>(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);

	const { user } = useAuth();
	const { notifySuccess, notifyError } = useNotification();

	// Define query keys to invalidate after successful creation
	const queryKeys = ['sectorsList'];

	// Mutation for creating sector
	const mutation = useMutateDate<SectorDataDTO, SectorDataDTO>('/sectores', {
		onSuccess: () => {
			notifySuccess(
				'El sector se ha creado correctamente en el sistema',
				'Sector creado',
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
				notifyError(err.message, 'Error al crear el sector');
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
				formData[key as keyof SectorFormData] !==
				valueInitial[key as keyof SectorFormData],
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

	// Handle confirmation of sector creation
	const handleConfirm = async () => {
		setShowConfirmation(false);

		if (user) {
			const createDate = new Date().toISOString();
			const sectorData: SectorDataDTO = {
				nombre: formData.nombre,
				estado: 'Activo',
				creadoPor: user.id,
				fechaCreacion: createDate,
			};

			console.log('sectorData', sectorData);
			await mutation.mutateAsync(sectorData);

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
					Crear Sector
				</Typography>

				<TextField
					required
					fullWidth
					id='nombre'
					label='Nombre'
					name='nombre'
					value={formData.nombre}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.nombre)}
					helperText={attemptedSubmit && errors.nombre}
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

			{/* Confirmation dialog for creating sector */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar creación'
				message='¿Está seguro que desea crear este sector con el nombre ingresado?'
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

export default CreateSectorForm;
