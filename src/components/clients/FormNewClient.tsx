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
import { useAuth } from '../../context/AuthContext';

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
	// Estado para controlar el diálogo de confirmación
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	// Estado para manejar cambios pendientes (para el botón cancelar)
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	// Estado para el diálogo de confirmación de cancelar
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);

	const { user } = useAuth();

	// Validar formulario cada vez que cambian los datos
	useEffect(() => {
		const validateForm = async () => {
			try {
				await validationSchema.validate(formData, {
					abortEarly: false,
					context: { userRole: user?.nRole, sType: formData.sType },
				});
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
	}, [formData, user?.nRole]);

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

		try {
			await validationSchema.validate(formData, {
				abortEarly: false,
				context: { userRole: user?.nRole, sType: formData.sType },
			});
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
		data: planesList,
		isLoading: loadingPlanes,
		error: errorPlanes,
	} = useFetchData<SelectList[]>('/plans/list', 'plans-list');

	const {
		data: sectoresList,
		isLoading: loadingSectors,
		error: errorSectors,
	} = useFetchData<SelectList[]>('/sectors/list', 'sectors-list');

	const {
		data: ownersList,
		isLoading: loadingOwners,
		error: errorOwners,
	} = useFetchData<SelectList[]>('/users/providers', 'providers-list');

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
							id='sName'
							label='Razón Social'
							name='sName'
							value={formData.sName}
							onChange={handleChange}
							margin='normal'
							placeholder='Nombre de la empresa o persona'
							error={Boolean(errors.sName)}
							helperText={
								errors.sName !== 'Este campo es obligatorio'
									? errors.sName
									: ''
							}
						/>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Grid container spacing={1}>
								<Grid item xs={3}>
									<FormControl
										fullWidth
										required
										margin='normal'
										error={Boolean(errors.typeDni)}
									>
										<InputLabel id='type-dni-label'>Tipo</InputLabel>
										<Select
											labelId='type-dni-label'
											id='typeDni'
											name='typeDni'
											value={formData.typeDni}
											onChange={handleSelectChange}
											label='Tipo'
										>
											<MenuItem value='V'>V-</MenuItem>
											<MenuItem value='E'>E-</MenuItem>
											<MenuItem value='J'>J-</MenuItem>
										</Select>
										{errors.typeDni && (
											<FormHelperText>
												{errors.typeDni !== 'Este campo es obligatorio'
													? errors.typeDni
													: ''}
											</FormHelperText>
										)}
									</FormControl>
								</Grid>
								<Grid item xs={9}>
									<TextField
										required
										fullWidth
										id='sDni'
										label='Documento de Identidad'
										name='sDni'
										value={formData.sDni}
										onChange={handleChange}
										margin='normal'
										placeholder='Número de documento'
										error={Boolean(errors.sDni)}
										helperText={
											errors.sDni !== 'Este campo es obligatorio'
												? errors.sDni
												: ''
										}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={6}>
							<TextField
								required
								fullWidth
								id='sPhone'
								label='Teléfono'
								name='sPhone'
								value={formData.sPhone}
								onChange={handleChange}
								margin='normal'
								placeholder='58123456789'
								error={Boolean(errors.sPhone)}
								helperText={
									errors.sPhone !== 'Este campo es obligatorio'
										? errors.sPhone
										: ''
								}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id='sAddress'
							label='Dirección'
							name='sAddress'
							value={formData.sAddress}
							onChange={handleChange}
							margin='normal'
							placeholder='Calle 123, Barrio Centro, Carabobo, Venezuela'
							error={Boolean(errors.sAddress)}
							helperText={
								errors.sAddress !== 'Este campo es obligatorio'
									? errors.sAddress
									: ''
							}
						/>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={user?.nRole === 3 ? 12 : 6}>
							<TextField
								fullWidth
								id='sGps'
								label='Coordenadas'
								name='sGps'
								value={formData.sGps}
								onChange={handleChange}
								margin='normal'
								placeholder='10.1234567, -66.1234567'
								error={Boolean(errors.sGps)}
								helperText={
									errors.sGps !== 'Este campo es obligatorio'
										? errors.sGps
										: ''
								}
							/>
						</Grid>
						{user?.nRole !== 3 && (
							<Grid item xs={6}>
								<FormControl
									fullWidth
									required
									margin='normal'
									error={Boolean(errors.idOwner)}
								>
									<InputLabel id='owner-label'>Proveedor</InputLabel>
									<Select
										labelId='owner-label'
										id='idOwner'
										name='idOwner'
										value={formData.idOwner}
										onChange={handleSelectChange}
										label='Proveedor'
									>
										{loadingOwners ? (
											<MenuItem disabled>
												<CircularProgress size={20} /> Cargando...
											</MenuItem>
										) : (
											ownersList &&
											!errorOwners &&
											ownersList.map((owner) => (
												<MenuItem key={owner.id} value={owner.id}>
													{owner.tag}
												</MenuItem>
											))
										)}
										{errors.idOwner && (
											<FormHelperText>
												{errors.idOwner !== 'Este campo es obligatorio'
													? errors.idOwner
													: ''}
											</FormHelperText>
										)}
									</Select>
								</FormControl>
							</Grid>
						)}
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<FormControl
								fullWidth
								required
								margin='normal'
								error={Boolean(errors.idSector)}
							>
								<InputLabel id='sector-label'>Sector</InputLabel>
								<Select
									labelId='sector-label'
									id='idSector'
									name='idSector'
									value={formData.idSector}
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
											<MenuItem key={sector.id} value={sector.id}>
												{sector.sName}
											</MenuItem>
										))
									)}
									{errors.idSector && (
										<FormHelperText>
											{errors.idSector !== 'Este campo es obligatorio'
												? errors.idSector
												: ''}
										</FormHelperText>
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl
								fullWidth
								required
								margin='normal'
								error={Boolean(errors.idSubscription)}
							>
								<InputLabel id='plan-label'>Plan</InputLabel>
								<Select
									labelId='plan-label'
									id='idSubscription'
									name='idSubscription'
									value={formData.idSubscription}
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
											<MenuItem key={plan.id} value={plan.id}>
												{plan.sName}
											</MenuItem>
										))
									)}
								</Select>
								{errors.idSubscription && (
									<FormHelperText>
										{errors.idSubscription !== 'Este campo es obligatorio'
											? errors.idSubscription
											: ''}
									</FormHelperText>
								)}
							</FormControl>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<FormControl
								fullWidth
								margin='normal'
								error={Boolean(errors.sType)}
								required
							>
								<InputLabel id='type-label'>Tipo</InputLabel>
								<Select
									labelId='type-label'
									id='sType'
									name='sType'
									value={formData.sType}
									onChange={handleSelectChange}
									label='Tipo'
								>
									<MenuItem value='RF'>Radio Frecuencia</MenuItem>
									<MenuItem value='FO'>Fibra Óptica</MenuItem>
								</Select>
								{errors.sType && (
									<FormHelperText>
										{errors.sType !== 'Este campo es obligatorio'
											? errors.sType
											: ''}
									</FormHelperText>
								)}
							</FormControl>
						</Grid>
						{formData.sType === 'RF' && (
							<Grid item xs={6}>
								<TextField
									fullWidth
									id='sIp'
									label='IP'
									name='sIp'
									value={formData.sIp}
									onChange={handleChange}
									margin='normal'
									placeholder='192.168.1.2'
									error={Boolean(errors.sIp)}
									helperText={
										errors.sIp !== 'Este campo es obligatorio'
											? errors.sIp
											: ''
									}
								/>
							</Grid>
						)}

						{formData.sType === 'FO' && (
							<Grid item xs={6}>
								<TextField
									fullWidth
									id='sSn'
									label='Serial Number'
									name='sSn'
									value={formData.sSn}
									onChange={handleChange}
									margin='normal'
									placeholder='VSOL123ABC12'
									error={Boolean(errors.sSn)}
									helperText={
										errors.sSn !== 'Este campo es obligatorio'
											? errors.sSn
											: ''
									}
								/>
							</Grid>
						)}
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							rows={3}
							id='sCommentary'
							label='Comentario'
							name='sCommentary'
							value={formData.sCommentary}
							onChange={handleChange}
							margin='normal'
							error={Boolean(errors.sCommentary)}
							helperText={
								errors.sCommentary !== 'Este campo es obligatorio'
									? errors.sCommentary
									: ''
							}
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
