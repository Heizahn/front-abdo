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
import { queryClient } from '../../query-client';
import { useNotification } from '../../context/NotificationContext';

// Define the interface for the sector detail data
interface SectorDetailData {
	_id: string;
	nombre: string;
	estado: string;
	creadoPor: string;
	editadoPor?: string;
	fechaCreacion: string;
	fechaEdicion?: string;
}

// Validation schema using Yup
const validationSchema = yup.object({
	nombre: yup.string().required('El nombre es obligatorio'),
	estado: yup.string().required('El estado es obligatorio'),
});

interface SectorDetailProps {
	sectorData: SectorDetailData;
	onClose: () => void;
}

const SectorDetail: React.FC<SectorDetailProps> = ({ sectorData, onClose }) => {
	const [formData, setFormData] = useState<SectorDetailData>(sectorData);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isValid, setIsValid] = useState<boolean>(true);
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);

	const { user } = useAuth();
	const { notifySuccess, notifyError } = useNotification();

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
				formData[key as keyof SectorDetailData] !==
				sectorData[key as keyof SectorDetailData],
		);

		setHasChanges(hasAnyChanges);
	}, [formData, sectorData]);

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

	// Handle confirmation of sector update
	const handleConfirm = async () => {
		// Prepare the payload for the API
		const updatedSector = {
			estado: formData.estado,
			nombre: formData.nombre,
			fechaEdicion: new Date().toISOString(),
			editadoPor: user?.id,
		};

		try {
			await axios.patch(HOST_API + '/sectores/' + sectorData._id, updatedSector);

			notifySuccess('Sector actualizado correctamente', 'Sector actualizado');

			queryClient.invalidateQueries({
				queryKey: ['sectorsList'],
				predicate: (query) => query.queryKey.includes('sectorsList'),
			});
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al actualizar el sector');
			}
		} finally {
			setShowConfirmation(false);
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

	// Format date for display
	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h6' gutterBottom>
					Detalles del Sector
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

				<Box sx={{ mt: 2, mb: 2 }}>
					<Typography
						variant='caption'
						display='block'
						sx={{ color: 'text.secondary' }}
					>
						Creado el: {formatDate(formData.fechaCreacion)}
						{formData.creadoPor && ` por ${formData.creadoPor}`}
					</Typography>

					{formData.fechaEdicion && (
						<Typography
							variant='caption'
							display='block'
							sx={{ color: 'text.secondary' }}
						>
							Última modificación: {formatDate(formData.fechaEdicion)}
							{formData.editadoPor && ` por ${formData.editadoPor}`}
						</Typography>
					)}
				</Box>

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

			{/* Confirmation dialog for updating sector */}
			<ConfirmDialog
				open={showConfirmation}
				onClose={handleCancelConfirmation}
				onConfirm={handleConfirm}
				title='Confirmar actualización'
				message='¿Está seguro que desea guardar los cambios realizados en este sector?'
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

export default SectorDetail;
