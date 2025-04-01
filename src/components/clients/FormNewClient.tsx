import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
	TextField,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	SelectChangeEvent,
	CircularProgress,
	Typography,
	FormHelperText,
} from '@mui/material';
import ConfirmDialog from '../common/Confirm';
import { useFetchData } from '../../hooks/useQuery';
import { ClientFormData, SelectList } from '../../interfaces/types';
import { validationSchema, valueInitial } from './Validate';
import * as yup from 'yup';

interface ClientFormProps {
	onSubmit: (data: ClientFormData) => void;
	onCancel: () => void;
	closeModal?: () => void;
}

const ClientFormWithConfirmation: React.FC<ClientFormProps> = ({
	onSubmit,
	onCancel,
	closeModal,
}) => {
	const [formData, setFormData] = useState<ClientFormData>(valueInitial);

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

	// Validar formulario cada vez que cambian los datos
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

		// Determinar si hay cambios en el formulario
		const initialFormData: ClientFormData = valueInitial;

		const hasAnyChanges = Object.keys(formData).some(
			(key) =>
				formData[key as keyof ClientFormData] !==
				initialFormData[key as keyof ClientFormData],
		);

		setHasChanges(hasAnyChanges);
	}, [formData]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

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

	// Manejador para confirmar la acción de creación
	const handleConfirm = () => {
		onSubmit(formData);
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

	// Usar hooks personalizados para cargar los datos
	const {
		data: routerList,
		isLoading: loadingRouters,
		error: errorRouters,
	} = useFetchData<SelectList[]>('/routersList', 'routersList');

	const {
		data: planesList,
		isLoading: loadingPlanes,
		error: errorPlanes,
	} = useFetchData<SelectList[]>('/plansList', 'plansList');

	const {
		data: sectoresList,
		isLoading: loadingSectors,
		error: errorSectors,
	} = useFetchData<SelectList[]>('/sectorsList', 'sectorsList');

	return (
		<>
			<Box component='form' onSubmit={handleFormSubmit} noValidate>
				<Typography variant='h5' component='h2' gutterBottom>
					Crear Cliente
				</Typography>
				<Grid container>
					<Grid item xs={12}>
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
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id='identificacion'
							label='Documento de Identidad'
							name='identificacion'
							value={formData.identificacion}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.identificacion)}
							helperText={attemptedSubmit && errors.identificacion}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id='telefonos'
							label='Teléfono'
							name='telefonos'
							value={formData.telefonos}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.telefonos)}
							helperText={attemptedSubmit && errors.telefonos}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id='direccion'
							label='Dirección'
							name='direccion'
							value={formData.direccion}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.direccion)}
							helperText={attemptedSubmit && errors.direccion}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							id='coordenadas'
							label='Coordenadas'
							name='coordenadas'
							value={formData.coordenadas}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.coordenadas)}
							helperText={attemptedSubmit && errors.coordenadas}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id='email'
							label='Correo'
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.email)}
							helperText={attemptedSubmit && errors.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl
							fullWidth
							required
							margin='normal'
							error={Boolean(attemptedSubmit && errors.sectoresId)}
						>
							<InputLabel id='sector-label'>Sector</InputLabel>
							<Select
								labelId='sector-label'
								id='sectoresId'
								name='sectoresId'
								value={formData.sectoresId}
								onChange={handleSelectChange}
								label='Sector'
							>
								{loadingSectors ? (
									<MenuItem disabled>
										<CircularProgress size={20} /> Cargando...
									</MenuItem>
								) : (
									sectoresList &&
									!errorSectors &&
									sectoresList.map((sector) => (
										<MenuItem
											key={sector.id || sector._id}
											value={sector.id || sector._id}
										>
											{sector.nombre}
										</MenuItem>
									))
								)}
							</Select>
							{attemptedSubmit && errors.sectoresId && (
								<FormHelperText>{errors.sectoresId}</FormHelperText>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl
							fullWidth
							required
							margin='normal'
							error={Boolean(attemptedSubmit && errors.planesId)}
						>
							<InputLabel id='plan-label'>Plan</InputLabel>
							<Select
								labelId='plan-label'
								id='planesId'
								name='planesId'
								value={formData.planesId}
								onChange={handleSelectChange}
								label='Plan'
							>
								{loadingPlanes ? (
									<MenuItem disabled>
										<CircularProgress size={20} /> Cargando...
									</MenuItem>
								) : (
									planesList &&
									!errorPlanes &&
									planesList.map((plan) => (
										<MenuItem
											key={plan.id || plan._id}
											value={plan.id || plan._id}
										>
											{plan.nombre}
										</MenuItem>
									))
								)}
							</Select>
							{attemptedSubmit && errors.planesId && (
								<FormHelperText>{errors.planesId}</FormHelperText>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							id='ipv4'
							label='IP'
							name='ipv4'
							value={formData.ipv4}
							onChange={handleChange}
							margin='normal'
							error={Boolean(attemptedSubmit && errors.ipv4)}
							helperText={attemptedSubmit && errors.ipv4}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl
							fullWidth
							margin='normal'
							error={Boolean(attemptedSubmit && errors.routersId)}
						>
							<InputLabel id='router-label'>Router</InputLabel>
							<Select
								labelId='router-label'
								id='routersId'
								name='routersId'
								value={formData.routersId}
								onChange={handleSelectChange}
								label='Router'
							>
								{loadingRouters ? (
									<MenuItem disabled>
										<CircularProgress size={20} /> Cargando...
									</MenuItem>
								) : (
									routerList &&
									!errorRouters &&
									routerList.map((router) => (
										<MenuItem key={router.id} value={router.id}>
											{router.nombre}
										</MenuItem>
									))
								)}
							</Select>
							{attemptedSubmit && errors.routersId && (
								<FormHelperText>{errors.routersId}</FormHelperText>
							)}
						</FormControl>
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
				message='¿Está seguro que desea crear este cliente con los datos ingresados?'
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
};

export default ClientFormWithConfirmation;
