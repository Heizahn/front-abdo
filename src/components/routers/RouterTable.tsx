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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useFetchData } from '../../hooks/useQuery';
import SimpleModalWrapper from '../common/ContainerForm';
import Create from './Create';
import { useNavigate } from 'react-router-dom';

interface Router {
	_id: string;
	nombre: string;
	ip: string;
	fechaCreacion: string;
	creadoPor: string;
	fechaEdicion?: string;
	editadoPor?: string;
	estado: string;
	direccion: string;
	marca: string;
	modelo: string;
	descripcion: string;
	sectores: string;
	clientes: number;
}

// Tipo para ordenar
type Order = 'asc' | 'desc';
type OrderBy = keyof Router;

const RouterTable: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('fechaCreacion');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();
	const { data: routersData = [], isLoading } = useFetchData<Router[]>(
		'/routersList',
		'routersList',
	);

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

	const filteredPagos = useMemo(() => {
		return routersData
			.filter(
				(pago) =>
					!searchTerm || // Si no hay término de búsqueda, incluir todos
					safeIncludes(pago.nombre, searchTerm) ||
					safeIncludes(pago.ip, searchTerm) ||
					safeIncludes(pago.fechaCreacion, searchTerm) ||
					safeIncludes(pago.creadoPor, searchTerm) ||
					safeIncludes(pago.sectores, searchTerm) ||
					safeIncludes(pago.estado, searchTerm),
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
	}, [routersData, searchTerm, orderBy, order]);

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
		<>
			<Box
				sx={{
					mt: 3,
					mb: 2,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					px: 2,
				}}
			>
				<Typography variant='h5' gutterBottom>
					Equipos
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<SimpleModalWrapper showCloseButton={false} triggerButtonText='Crear'>
						<Create onCancel={() => {}} />
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
					borderBottomRightRadius: 8,
					borderBottomLeftRadius: 8,
				}}
			>
				<TableContainer sx={{ maxHeight: 860 }} ref={containerRef}>
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
										active={orderBy === 'ip'}
										direction={orderBy === 'ip' ? order : 'asc'}
										onClick={createSortHandler('ip')}
									>
										IP
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'sectores'}
										direction={orderBy === 'sectores' ? order : 'asc'}
										onClick={createSortHandler('sectores')}
									>
										Sector
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'creadoPor'}
										direction={orderBy === 'creadoPor' ? order : 'asc'}
										onClick={createSortHandler('creadoPor')}
									>
										Creado Por
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'clientes'}
										direction={orderBy === 'clientes' ? order : 'asc'}
										onClick={createSortHandler('clientes')}
									>
										Clientes
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
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={9} align='center'>
										<CircularProgress size={40} sx={{ my: 2 }} />
									</TableCell>
								</TableRow>
							) : visibleData.length > 0 ? (
								<>
									{visibleData.map((equipment) => (
										<TableRow
											key={equipment._id}
											hover
											sx={{
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
												},
											}}
											onClick={() => {
												navigate(`/router/${equipment._id}`);
											}}
										>
											<TableCell>{equipment.nombre || '-'}</TableCell>
											<TableCell>{equipment.ip || '-'}</TableCell>
											<TableCell>{equipment.sectores || '-'}</TableCell>
											<TableCell>{equipment.creadoPor || '-'}</TableCell>
											<TableCell>{equipment.clientes || 0}</TableCell>
											<TableCell>
												{equipment.estado
													? renderEstadoChip(equipment.estado)
													: '-'}
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
										No hay routers u OLTs disponibles
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</>
	);
};

export default RouterTable;
