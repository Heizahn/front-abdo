import {
	TextField,
	Box,
	Chip,
	Button,
	CircularProgress,
	Checkbox,
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	InputAdornment,
	Typography,
	Popper,
	ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import axios from 'axios';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { HOST_API } from '../../../config/env';
import { ClientRouterTable as Client } from '../../../interfaces/types';
import { useNotification } from '../../../context/NotificationContext';
import { queryClient } from '../../../query-client';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

// Número de elementos a mostrar inicialmente y cuántos cargar en cada scroll
const INITIAL_ITEMS = 50;
const ITEMS_PER_LOAD = 30;

export default function AddClient({
	routerId,
	clientsOnRouter,
	onCancel,
}: {
	routerId: string;
	clientsOnRouter: Client[];
	onCancel?: () => void;
}) {
	const [clients, setClients] = useState<Client[]>([]);
	const [selectedClients, setSelectedClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchInput, setSearchInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [visibleItems, setVisibleItems] = useState(INITIAL_ITEMS);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [firstClick, setFirstClick] = useState(true);
	const [scrollInitialized, setScrollInitialized] = useState(false);

	const anchorRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { notifySuccess, notifyError } = useNotification();

	const queryKeys = ['router-' + routerId, 'client-', 'clients-'];

	useEffect(() => {
		const getClients = async () => {
			try {
				setLoading(true);
				const { data } = await axios.get<[{ clients: Client[] }]>(
					`${HOST_API}/clientsAllSimple`,
				);

				const filteredClients = data[0].clients.filter(
					(client) => !clientsOnRouter.some((c) => c._id === client._id),
				);

				setClients(filteredClients);
			} catch (error) {
				console.error('Error fetching clients:', error);
			} finally {
				setLoading(false);
			}
		};
		getClients();
	}, [clientsOnRouter]);

	// Corregir el problema de cierre en el primer clic
	useEffect(() => {
		if (firstClick && open) {
			// Prevenir que se cierre inmediatamente después del primer clic
			const timer = setTimeout(() => {
				setFirstClick(false);
			}, 300);

			return () => clearTimeout(timer);
		}
	}, [open, firstClick]);

	// Garantizar que el evento de scroll esté configurado después de que se carguen los datos
	useEffect(() => {
		if (!loading && clients.length > 0 && !scrollInitialized) {
			setScrollInitialized(true);

			// Verificar si hay más elementos para cargar inicialmente
			if (clients.length > INITIAL_ITEMS) {
				// Forzar una comprobación inicial de scroll para cargar más elementos si es necesario
				setTimeout(() => {
					const currentListRef = listRef.current;
					if (currentListRef) {
						handleScroll();
					}
				}, 300);
			}
		}
	}, [loading, clients.length]);

	// Abrir el dropdown cuando se escribe en el campo de búsqueda
	useEffect(() => {
		if (searchInput.trim() !== '') {
			setOpen(true);
		}
	}, [searchInput]);

	// Manejar correctamente las operaciones asíncronas
	const handleAddClients = async () => {
		if (selectedClients.length === 0 || submitting) return;

		setSubmitting(true);

		try {
			// Usar Promise.all para esperar a que todas las operaciones asíncronas terminen
			await Promise.all(
				selectedClients.map((client) =>
					axios.patch(`${HOST_API}/clientes/${client._id}`, {
						routersId: routerId,
					}),
				),
			);

			// Una vez que todas las operaciones han terminado, invalidar las consultas
			for (const key of queryKeys) {
				await queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			}

			notifySuccess('Clientes agregados correctamente', 'Clientes agregados');

			// Limpiar y cerrar
			setSelectedClients([]);
			setSearchInput('');
			setOpen(false);

			// Llamar al callback de cancelar/cerrar
			if (onCancel) {
				onCancel();
			}
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al agregar clientes');
			} else {
				notifyError('Error desconocido', 'Error al agregar clientes');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setSelectedClients([]);
		setSearchInput('');
		setOpen(false);
		if (onCancel) {
			onCancel();
		}
	};

	const handleFieldFocus = () => {
		setOpen(true);
		// Si es el primer clic, necesitamos mantener el menú abierto
		if (firstClick) {
			setTimeout(() => {
				setOpen(true);
			}, 50);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
		setOpen(true); // Abrir el menú al escribir
	};

	const handleToggleClient = (client: Client) => (event: React.MouseEvent) => {
		event.stopPropagation();

		setSelectedClients((prev) => {
			const isSelected = prev.some((c) => c._id === client._id);
			return isSelected ? prev.filter((c) => c._id !== client._id) : [...prev, client];
		});
	};

	// Optimizado: función para buscar clientes utilizando memoización
	const filteredClients = useMemo(() => {
		if (!searchInput.trim()) return clients;

		const searchLower = searchInput.toLowerCase().trim();

		return clients.filter(
			(client) =>
				client.nombre.toLowerCase().includes(searchLower) ||
				(client.identificacion &&
					client.identificacion.toLowerCase().includes(searchLower)) ||
				(client.ipv4 && client.ipv4.toLowerCase().includes(searchLower)),
		);
	}, [clients, searchInput]);

	// Optimizar ordenación de resultados
	const sortedClients = useMemo(() => {
		if (!searchInput.trim()) return filteredClients;

		const searchLower = searchInput.toLowerCase().trim();

		return [...filteredClients].sort((a, b) => {
			// Dar prioridad a las coincidencias exactas al inicio del nombre
			const aStartsWith = a.nombre.toLowerCase().startsWith(searchLower);
			const bStartsWith = b.nombre.toLowerCase().startsWith(searchLower);

			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;

			// Si ambos empiezan o ninguno empieza con el término de búsqueda,
			// ordenar alfabéticamente
			return a.nombre.localeCompare(b.nombre);
		});
	}, [filteredClients, searchInput]);

	// Solo mostrar el número de elementos especificado en visibleItems
	const visibleClients = useMemo(() => {
		return sortedClients.slice(0, visibleItems);
	}, [sortedClients, visibleItems]);

	// Manejar scroll para cargar más elementos
	const handleScroll = useCallback(() => {
		if (!listRef.current || isLoadingMore) return;

		const { scrollTop, scrollHeight, clientHeight } = listRef.current;

		// Si estamos cerca del final, cargar más elementos
		if (scrollHeight - scrollTop - clientHeight < 200) {
			if (visibleItems < sortedClients.length) {
				setIsLoadingMore(true);

				// Usar setTimeout para evitar bloquear la UI
				setTimeout(() => {
					setVisibleItems((prev) =>
						Math.min(prev + ITEMS_PER_LOAD, sortedClients.length),
					);
					setIsLoadingMore(false);
				}, 100);
			}
		}
	}, [visibleItems, sortedClients.length, isLoadingMore]);

	// Configurar el evento de scroll
	useEffect(() => {
		const currentListRef = listRef.current;
		if (currentListRef) {
			// Remover el listener anterior si existe
			currentListRef.removeEventListener('scroll', handleScroll);
			// Agregar el nuevo listener
			currentListRef.addEventListener('scroll', handleScroll);
			return () => {
				currentListRef.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	// Resetear visibleItems cuando cambia la búsqueda
	useEffect(() => {
		setVisibleItems(INITIAL_ITEMS);
	}, [searchInput]);

	// Simular un evento de scroll cuando el menú se abre
	useEffect(() => {
		if (open && listRef.current) {
			setTimeout(() => {
				handleScroll();
			}, 200);
		}
	}, [open]);

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 900,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<Box ref={anchorRef} sx={{ position: 'relative' }}>
				<TextField
					fullWidth
					label='Buscar clientes'
					placeholder='Escriba para buscar clientes'
					value={searchInput}
					onChange={handleSearchChange}
					onFocus={handleFieldFocus}
					onClick={handleFieldFocus}
					inputRef={inputRef}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon />
							</InputAdornment>
						),
						endAdornment: loading ? (
							<InputAdornment position='end'>
								<CircularProgress color='inherit' size={20} />
							</InputAdornment>
						) : null,
					}}
				/>

				{/* Chips de clientes seleccionados */}
				{selectedClients.length > 0 && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
						{selectedClients.map((client) => (
							<Chip
								key={client._id}
								label={client.nombre}
								variant='outlined'
								onDelete={() => {
									setSelectedClients((prev) =>
										prev.filter((c) => c._id !== client._id),
									);
								}}
								size='small'
							/>
						))}
					</Box>
				)}

				{/* Lista desplegable optimizada */}
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					placement='bottom-start'
					style={{
						width: anchorRef.current?.clientWidth,
						zIndex: 1300,
						marginTop: '2px',
					}}
				>
					<ClickAwayListener onClickAway={() => setOpen(false)}>
						<Paper
							elevation={3}
							sx={{
								maxHeight: 350,
								border: '1px solid #e0e0e0',
								borderRadius: 1,
							}}
						>
							<Box
								ref={listRef}
								sx={{
									overflow: 'auto',
									maxHeight: 350,
								}}
								onScroll={handleScroll}
							>
								{loading ? (
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											p: 2,
										}}
									>
										<CircularProgress size={24} />
									</Box>
								) : visibleClients.length === 0 ? (
									<Box sx={{ p: 2 }}>
										<Typography variant='body2' color='text.secondary'>
											No se encontraron clientes
										</Typography>
									</Box>
								) : (
									<>
										<List dense sx={{ py: 0 }}>
											{visibleClients.map((client) => {
												const isSelected = selectedClients.some(
													(c) => c._id === client._id,
												);
												return (
													<ListItem
														key={client._id}
														component='div'
														sx={{
															py: 0.5,
															'&:hover': {
																backgroundColor:
																	'rgba(0, 0, 0, 0.04)',
															},
															cursor: 'pointer',
															...(isSelected && {
																backgroundColor:
																	'rgba(25, 118, 210, 0.12) !important',
															}),
														}}
														onClick={handleToggleClient(client)}
													>
														<ListItemIcon sx={{ minWidth: 36 }}>
															<Checkbox
																icon={icon}
																checkedIcon={checkedIcon}
																edge='start'
																checked={isSelected}
																tabIndex={-1}
																disableRipple
																onClick={(e) =>
																	e.stopPropagation()
																}
															/>
														</ListItemIcon>
														<ListItemText
															primary={client.nombre}
															secondary={
																<>
																	{client.identificacion &&
																		`ID: ${client.identificacion}`}
																	{client.identificacion &&
																		client.ipv4 &&
																		' • '}
																	{client.ipv4 &&
																		`IP: ${client.ipv4}`}
																</>
															}
															primaryTypographyProps={{
																variant: 'body2',
																fontWeight: isSelected
																	? 'medium'
																	: 'normal',
															}}
															secondaryTypographyProps={{
																variant: 'caption',
																color: 'text.secondary',
															}}
														/>
													</ListItem>
												);
											})}
										</List>

										{/* Indicador de carga para la carga incremental */}
										{isLoadingMore && (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													py: 1,
												}}
											>
												<CircularProgress size={20} />
											</Box>
										)}

										{/* Mensaje cuando se llega al final de los resultados */}
										{!isLoadingMore &&
											visibleItems >= sortedClients.length &&
											sortedClients.length > INITIAL_ITEMS && (
												<Box sx={{ py: 1 }}>
													<Typography
														variant='caption'
														color='text.secondary'
														align='center'
														sx={{ display: 'block' }}
													>
														Has llegado al final de los resultados
													</Typography>
												</Box>
											)}
									</>
								)}
							</Box>
						</Paper>
					</ClickAwayListener>
				</Popper>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
				<Button
					variant='outlined'
					color='inherit'
					onClick={handleCancel}
					disabled={submitting}
				>
					Cancelar
				</Button>
				<Button
					variant='contained'
					color='primary'
					disabled={selectedClients.length === 0 || loading || submitting}
					onClick={handleAddClients}
				>
					{submitting ? (
						<>
							<CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
							Agregando...
						</>
					) : (
						`Agregar Clientes (${selectedClients.length})`
					)}
				</Button>
			</Box>
		</Box>
	);
}
