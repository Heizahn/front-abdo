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
	Grid,
} from '@mui/material';
import ConfirmDialog from '../common/Confirm'; // Adjust path as needed
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { HOST_API } from '../../config/env';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';

// Define the interface for the service form data
interface ServiceDetailData {
	id: string;
	sName: string;
	nAmount: number;
	nMBPS: number;
	sState: string;
	creator: string;
	dCreation: string;
	editor: string;
	dEdition: string;
}

// Validation schema using Yup
const validationSchema = yup.object({
	sName: yup.string().required('El nombre es obligatorio'),
	nAmount: yup.number().required('El costo es obligatorio'),
	nMBPS: yup.number().required('La velocidad es obligatoria'),
	sState: yup.string().required('El estado es obligatorio'),
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
			sName: formData.sName,
			nAmount: Number(formData.nAmount),
			nMBPS: Number(formData.nMBPS),
			sState: formData.sState,
			idEditor: user?.id,
			dEdition: new Date().toISOString(),
		};

		try {
			await axios.patch(`${HOST_API}/plans/${serviceData.id}`, updatedService);

			notifySuccess('Servicio actualizado correctamente', 'Servicio actualizado');

			queryClient.invalidateQueries({
				queryKey: ['plans'],
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
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							required
							fullWidth
							id='nAmount'
							label='Costo ($)'
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
					</Grid>
					<Grid item xs={6}>
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
					</Grid>
				</Grid>

				<FormControl
					fullWidth
					required
					margin='normal'
					error={Boolean(attemptedSubmit && errors.sState)}
					size='small'
				>
					<InputLabel id='sState-label'>Estado</InputLabel>
					<Select
						labelId='sState-label'
						id='sState'
						name='sState'
						value={formData.sState}
						label='Estado'
						onChange={handleSelectChange}
					>
						<MenuItem value='Activo'>Activo</MenuItem>
						<MenuItem value='Inactivo'>Inactivo</MenuItem>
					</Select>
					{attemptedSubmit && errors.sState && (
						<FormHelperText>{errors.sState}</FormHelperText>
					)}
				</FormControl>

				{formData.dCreation && (
					<Typography
						variant='caption'
						display='block'
						sx={{ mt: 1, color: 'text.secondary' }}
					>
						Creado el: {new Date(formData.dCreation).toLocaleString()}
						{formData.creator &&
							` por ${formData.creator.toString().toUpperCase()}`}
					</Typography>
				)}

				{formData.dEdition && (
					<Typography
						variant='caption'
						display='block'
						sx={{ color: 'text.secondary' }}
					>
						Última modificación: {new Date(formData.dEdition).toLocaleString()}
						{formData.editor && ` por ${formData.editor.toString().toUpperCase()}`}
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
