import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
	TextField,
	Button,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	SelectChangeEvent,
} from '@mui/material';
import ConfirmDialog from '../common/Confirm'; // Adjust path as needed
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { HOST_API } from '../../../vite-env.d';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';

// Define the interface for the service form data
interface ServiceDetailData {
	_id: string;
	nombre: string;
	costo: string | number;
	tipo: string;
	descripcion: string;
	estado: string;
	creadoPor?: string;
	editadoPor?: string;
	fechaCreacion?: string;
	fechaEdicion?: string;
}

// Validation schema using Yup
const validationSchema = yup.object({
	nombre: yup.string().required('El nombre es obligatorio'),
	costo: yup
		.number()
		.typeError('El costo debe ser un número')
		.positive('El costo debe ser mayor que 0')
		.required('El costo es obligatorio'),
	tipo: yup.string().required('El tipo de servicio es obligatorio'),
	estado: yup.string().required('El estado es obligatorio'),
	descripcion: yup.string(),
});

interface ServiceDetailProps {
	serviceData: ServiceDetailData;
	onClose: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ serviceData, onClose }) => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<ServiceDetailData>(serviceData);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isValid, setIsValid] = useState<boolean>(true);
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);

	const { notifyError, notifySuccess } = useNotification();

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
				formData[key as keyof ServiceDetailData] !==
				serviceData[key as keyof ServiceDetailData],
		);

		setHasChanges(hasAnyChanges);
	}, [formData, serviceData]);

	// Handle input changes
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle select changes
	const handleSelectChange = (e: SelectChangeEvent) => {
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

	// Handle confirmation of service update
	const handleConfirm = async () => {
		// Prepare the payload for the API
		const updatedService = {
			nombre: formData.nombre,
			costo: Number(formData.costo),
			tipo: formData.tipo,
			descripcion: formData.descripcion,
			estado: formData.estado,
			fechaEdicion: new Date().toISOString(),
			editadoPor: user?.id,
		};

		try {
			await axios.patch(`${HOST_API}/planes/${serviceData._id}`, updatedService);

			notifySuccess('Servicio actualizado correctamente', 'Servicio actualizado');

			queryClient.invalidateQueries({
				queryKey: ['plansList'],
			});
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al actualizar el servicio');
			}
		} finally {
			// Close confirmation dialog
			setShowConfirmation(false);

			// Close the detail view
			onClose();
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
			onClose();
		}
	};

	// Handle confirmation of cancel
	const handleConfirmCancel = () => {
		setShowCancelConfirmation(false);
		onClose();
	};

	// Handle cancellation of cancel
	const handleCancelCancelConfirmation = () => {
		setShowCancelConfirmation(false);
	};

	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h6' gutterBottom>
					Detalles del Servicio
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

				<TextField
					required
					fullWidth
					id='costo'
					label='Costo ($)'
					name='costo'
					value={formData.costo}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.costo)}
					helperText={attemptedSubmit && errors.costo}
					size='small'
					inputProps={{
						inputMode: 'decimal',
					}}
				/>

				<TextField
					required
					fullWidth
					id='tipo'
					label='Tipo de Servicio'
					name='tipo'
					value={formData.tipo}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.tipo)}
					helperText={attemptedSubmit && errors.tipo}
					size='small'
				/>

				<TextField
					fullWidth
					id='descripcion'
					label='Descripción'
					name='descripcion'
					value={formData.descripcion}
					onChange={handleChange}
					margin='normal'
					error={Boolean(attemptedSubmit && errors.descripcion)}
					helperText={attemptedSubmit && errors.descripcion}
					size='small'
				/>

				<FormControl
					fullWidth
					required
					margin='normal'
					error={Boolean(attemptedSubmit && errors.estado)}
					size='small'
				>
					<InputLabel id='estado-label'>Estado</InputLabel>
					<Select
						labelId='estado-label'
						id='estado'
						name='estado'
						value={formData.estado}
						label='Estado'
						onChange={handleSelectChange}
					>
						<MenuItem value='Activo'>Activo</MenuItem>
						<MenuItem value='Inactivo'>Inactivo</MenuItem>
					</Select>
					{attemptedSubmit && errors.estado && (
						<FormHelperText>{errors.estado}</FormHelperText>
					)}
				</FormControl>

				{formData.fechaCreacion && (
					<Typography
						variant='caption'
						display='block'
						sx={{ mt: 1, color: 'text.secondary' }}
					>
						Creado el: {new Date(formData.fechaCreacion).toLocaleString()}
						{formData.creadoPor && ` por ${formData.creadoPor}`}
					</Typography>
				)}

				{formData.fechaEdicion && (
					<Typography
						variant='caption'
						display='block'
						sx={{ color: 'text.secondary' }}
					>
						Última modificación: {new Date(formData.fechaEdicion).toLocaleString()}
						{formData.editadoPor && ` por ${formData.editadoPor}`}
					</Typography>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
					<Button onClick={handleCancel} color='inherit'>
						Cancelar
					</Button>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						disabled={!isValid || !hasChanges}
					>
						Guardar
					</Button>
				</Box>
			</Box>

			{/* Confirmation dialog for updating service */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar actualización'
				message='¿Está seguro que desea guardar los cambios realizados en este servicio?'
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

export default ServiceDetail;
