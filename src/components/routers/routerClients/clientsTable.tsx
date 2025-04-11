import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Box,
	TextField,
	InputAdornment,
	Typography,
	CircularProgress,
	Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import SimpleModalWrapper from '../../common/ContainerForm';
import AddClient from './AddClient';
import QuitRouter from './QuitRouter';

export interface Client {
	_id: string;
	nombre: string;
	identificacion: string;
	ipv4: string;
	estado: string;
	editadoPor?: string;
	fechaEdicion?: string;
}

// Tipo para ordenar
type Order = 'asc' | 'desc';
type OrderBy = keyof Client;

export default function ClientsTable({
	clients,
	routerId,
}: {
	clients: Client[];
	routerId: string;
}) {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('nombre');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const modalTriggerRef = useRef<HTMLButtonElement>(null);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setVisibleItems(100);
	};

	const handleRequestSort = (property: OrderBy) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
		setVisibleItems(100);
	};

	const createSortHandler = (property: OrderBy) => () => {
		handleRequestSort(property);
	};

	const safeIncludes = (
		value: string | number | null | undefined,
		searchString: string,
	): boolean => {
		if (value == null) return false;
		return String(value).toLowerCase().includes(searchString.toLowerCase());
	};

	// Handle row click to show details
	const handleRowClick = (client: Client) => {
		setSelectedClient(client);

		if (modalTriggerRef.current) {
			modalTriggerRef.current.click();
		}
	};

	const filteredPagos = useMemo(() => {
		if (!searchTerm && orderBy === 'nombre' && order === 'desc') {
			return clients;
		}

		return clients
			.filter(
				(client) =>
					!searchTerm || // Si no hay término de búsqueda, incluir todos
					safeIncludes(client.nombre.toLowerCase(), searchTerm.toLowerCase()) ||
					safeIncludes(
						client.identificacion.toLowerCase(),
						searchTerm.toLowerCase(),
					) ||
					safeIncludes(client.ipv4, searchTerm) ||
					safeIncludes(client.estado.toLowerCase(), searchTerm.toLowerCase()),
			)
			.sort((a, b) => {
				const valueA = a[orderBy];
				const valueB = b[orderBy];

				if (valueA == null && valueB == null) return 0;
				if (valueA == null) return order === 'asc' ? -1 : 1;
				if (valueB == null) return order === 'asc' ? 1 : -1;

				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return order === 'asc' ? valueA - valueB : valueB - valueA;
				} else {
					const strA = String(valueA).toLowerCase();
					const strB = String(valueB).toLowerCase();
					return order === 'asc'
						? strA.localeCompare(strB)
						: strB.localeCompare(strA);
				}
			});
	}, [clients, searchTerm, orderBy, order]);

	const visibleData = useMemo(() => {
		return filteredPagos.slice(0, visibleItems);
	}, [filteredPagos, visibleItems]);

	const handleScroll = useCallback(() => {
		if (!containerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
		if (scrollHeight - scrollTop - clientHeight < 200 && !isLoadingMore) {
			if (visibleItems < filteredPagos.length) {
				setIsLoadingMore(true);

				setTimeout(() => {
					setVisibleItems((prev) => Math.min(prev + 50, filteredPagos.length));
					setIsLoadingMore(false);
				}, 150);
			}
		}
	}, [visibleItems, filteredPagos.length, isLoadingMore]);

	useEffect(() => {
		const currentContainer = containerRef.current;
		if (currentContainer) {
			currentContainer.addEventListener('scroll', handleScroll);
			return () => {
				currentContainer.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	const renderEstadoChip = (estado: string) => {
		let color: 'success' | 'error' = 'success';

		if (estado.toLowerCase() !== 'activo') {
			color = 'error';
		}

		return (
			<Typography variant='body1' display='block' color={color}>
				{estado}
			</Typography>
		);
	};

	return (
		<Box
			sx={{
				backgroundColor: 'background.paper',
				py: 2,
				px: 4,
				borderBottomRightRadius: 8,
				borderBottomLeftRadius: 8,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					px: 2,
					py: 1,
				}}
			>
				<Typography variant='h5'>Clientes</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<SimpleModalWrapper
						showCloseButton={false}
						triggerButtonText='Agregar'
						maxWidth='lg'
					>
						<AddClient routerId={routerId} clientsOnRouter={clients} />
					</SimpleModalWrapper>

					<TextField
						size='small'
						placeholder='Buscar'
						variant='outlined'
						value={searchTerm}
						onChange={handleSearchChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ width: '300px' }}
					/>
				</Box>
			</Box>

			<Paper
				sx={{
					flexGrow: 1,
					overflow: 'hidden',
					boxShadow: 'none',
					border: '1px solid rgba(224, 224, 224, 1)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<TableContainer sx={{ maxHeight: 675 }} ref={containerRef}>
					<Table stickyHeader size='small' aria-label='tabla de pagos'>
						<TableHead>
							<TableRow>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'nombre'}
										direction={orderBy === 'nombre' ? order : 'asc'}
										onClick={createSortHandler('nombre')}
									>
										Nombre
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'identificacion'}
										direction={
											orderBy === 'identificacion' ? order : 'asc'
										}
										onClick={createSortHandler('identificacion')}
									>
										Identidad
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'ipv4'}
										direction={orderBy === 'ipv4' ? order : 'asc'}
										onClick={createSortHandler('ipv4')}
									>
										IPv4
									</TableSortLabel>
								</TableCell>

								<TableCell>
									<TableSortLabel
										active={orderBy === 'estado'}
										direction={orderBy === 'estado' ? order : 'asc'}
										onClick={createSortHandler('estado')}
									>
										Estado
									</TableSortLabel>
								</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{visibleData.length > 0 ? (
								<>
									{visibleData.map((client) => (
										<TableRow
											key={client._id}
											hover
											onClick={() => handleRowClick(client)}
											sx={{
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
												},
											}}
										>
											<TableCell>{client.nombre || '-'}</TableCell>
											<TableCell>
												{client.identificacion || '-'}
											</TableCell>
											<TableCell>{client.ipv4 || '-'}</TableCell>

											<TableCell>
												{client.estado
													? renderEstadoChip(client.estado)
													: '-'}
											</TableCell>
											<TableCell onClick={(e) => e.stopPropagation()}>
												<QuitRouter clientId={client._id} />
											</TableCell>
										</TableRow>
									))}

									{isLoadingMore && (
										<TableRow>
											<TableCell
												colSpan={9}
												align='center'
												sx={{ py: 2 }}
											>
												<CircularProgress size={30} />
											</TableCell>
										</TableRow>
									)}

									{visibleItems >= filteredPagos.length &&
										filteredPagos.length > 100 && (
											<TableRow>
												<TableCell
													colSpan={9}
													align='center'
													sx={{ py: 1 }}
												>
													<Typography
														variant='body2'
														color='text.secondary'
													>
														Has llegado al final de los resultados
													</Typography>
												</TableCell>
											</TableRow>
										)}
								</>
							) : (
								<TableRow>
									<TableCell colSpan={9} align='center'>
										No hay pagos disponibles
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Botón oculto que sirve como trigger para el SimpleModalWrapper */}
			<div style={{ display: 'none' }}>
				<Button ref={modalTriggerRef} id='hidden-modal-trigger'>
					Trigger
				</Button>
			</div>

			{/* Modal para mostrar detalles del pago - Solo se renderiza cuando hay un pago seleccionado */}
			{selectedClient && (
				<SimpleModalWrapper
					showCloseButton={false}
					triggerComponent={
						<span id='modal-trigger-element' ref={modalTriggerRef} />
					}
					fullScreen={true}
					maxWidth='lg'
				>
					<>{modalTriggerRef.current}</>
				</SimpleModalWrapper>
			)}
		</Box>
	);
}
