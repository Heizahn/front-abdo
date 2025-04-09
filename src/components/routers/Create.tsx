import {
	Box,
	Button,
	CircularProgress,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import { useFetchData, useMutateDate } from '../../hooks/useQuery';
import ConfirmDialog from '../common/Confirm';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';
import { useAuth } from '../../context/AuthContext';
import { IValidate, validationSchema, initialValues, IRouterDTO } from './validate';
import { SelectList } from '../../interfaces/types';

type Props = {
	onCancel: () => void;
	closeModal?: () => void;
};
export default function Create({ onCancel, closeModal }: Props) {
	const { user } = useAuth();
	const [routerData, setRouterData] = useState<IValidate>(initialValues);
	const [sendingRouter, setSendingRouter] = useState(false);

	const [isValid, setIsValid] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);
	const { notifyError, notifySuccess } = useNotification();

	const queryKeys = ['routersList'];

	const mutation = useMutateDate<IRouterDTO, IRouterDTO>(`/routers`, {
		onSuccess: () => {
			notifySuccess('El router se ha creado correctamente', 'Router creado');
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al crear el router');
			}
		},
	});

	useEffect(() => {
		const validateForm = async () => {
			try {
				await validationSchema.validate(routerData, { abortEarly: false });
				setIsValid(true);
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

		const initialFormData: IValidate = initialValues;

		const hasAnyChanges = Object.keys(routerData).some(
			(key) =>
				routerData[key as keyof IValidate] !== initialFormData[key as keyof IValidate],
		);

		setHasChanges(hasAnyChanges);
	}, [routerData]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRouterData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent) => {
		const { name, value } = e.target;

		setRouterData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validationSchema.validate(routerData, { abortEarly: false });
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
		setSendingRouter(true);

		try {
			const Router: IRouterDTO = {
				...routerData,
				creadoPor: user?.id as string,
				estado: 'Activo',
				fechaCreacion: new Date().toISOString(),
			};

			await mutation.mutateAsync(Router);
		} finally {
			setShowConfirmation(false);

			if (closeModal) {
				closeModal();
			}
		}
	};

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

	const {
		data: sectoresList,
		isLoading: loadingSectors,
		error: errorSectors,
	} = useFetchData<SelectList[]>('/sectorsList', 'sectorsList');

	console.log(isValid);
	console.log(hasChanges);
	console.log(routerData);
	return (
		<Container sx={{ p: 3 }}>
			<>
				<Box component='form' onSubmit={handleFormSubmit} noValidate sx={{ mt: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoFocus
								margin='dense'
								id='nombre'
								name='nombre'
								label='Nombre'
								type='text'
								fullWidth
								value={routerData.nombre}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								autoFocus
								margin='dense'
								id='ip'
								name='ip'
								label='Dirección IP'
								type='text'
								fullWidth
								value={routerData.ip}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth margin='dense' required>
								<InputLabel id='label-sector'>Sector</InputLabel>
								<Select
									labelId='label-sector'
									id='sectoresId'
									name='sectoresId'
									value={routerData.sectoresId}
									label='Sector'
									onChange={handleSelectChange}
									required
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
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<TextField
								margin='dense'
								id='direccion'
								name='direccion'
								label='Dirección'
								type='text'
								fullWidth
								value={routerData.direccion}
								onChange={handleChange}
								variant='outlined'
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								margin='dense'
								id='descripcion'
								name='descripcion'
								label='Descripción'
								type='text'
								fullWidth
								multiline
								rows={3}
								value={routerData.descripcion}
								onChange={handleChange}
								variant='outlined'
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
								disabled={
									!isValid || !hasChanges || loadingSectors || sendingRouter
								}
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
					message='¿Está seguro que desea crear este router con los datos ingresados?'
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
		</Container>
	);
}
