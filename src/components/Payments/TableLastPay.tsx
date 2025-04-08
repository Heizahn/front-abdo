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
	Chip,
	CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useFetchData } from '../../hooks/useQuery';

interface Pago {
	_id: string;
	cliente: string;
	tipoPago: string;
	fecha: string;
	creadoPor: string;
	montoUSD: number;
	montoVES: string;
	referencia: string;
	comentario: string;
	estado: 'Activo' | 'Anulado';
}

// Props para el componente
interface TableLastPayProps {
	pagosSimpleData: Pago[];
	isLoadingSimple: boolean;
}

// Tipo para ordenar
type Order = 'asc' | 'desc';
type OrderBy = keyof Pago;

const TableLastPay: React.FC<TableLastPayProps> = ({ pagosSimpleData, isLoadingSimple }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('fecha');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: pagosCompletosData = [] } = useFetchData<Pago[]>('/paysList', 'paysList');
	const [datosCombinados, setDatosCombinados] = useState<Pago[]>([]);

	useEffect(() => {
		if (pagosSimpleData.length > 0 && datosCombinados.length === 0) {
			setDatosCombinados(pagosSimpleData);
		}
	}, [pagosSimpleData, datosCombinados.length]);

	useEffect(() => {
		if (pagosCompletosData.length > 0) {
			setDatosCombinados(pagosCompletosData);
		}
	}, [pagosCompletosData]);

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

	const safeIncludes = (value: any, searchString: string): boolean => {
		if (value == null) return false;
		return String(value).toLowerCase().includes(searchString.toLowerCase());
	};

	const filteredPagos = useMemo(() => {
		if (!searchTerm && orderBy === 'fecha' && order === 'desc') {
			return datosCombinados;
		}

		return datosCombinados
			.filter(
				(pago) =>
					!searchTerm || // Si no hay término de búsqueda, incluir todos
					safeIncludes(pago.cliente, searchTerm) ||
					safeIncludes(pago.tipoPago, searchTerm) ||
					safeIncludes(pago.fecha, searchTerm) ||
					safeIncludes(pago.creadoPor, searchTerm) ||
					safeIncludes(pago.referencia, searchTerm) ||
					safeIncludes(pago.comentario, searchTerm) ||
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
	}, [datosCombinados, searchTerm, orderBy, order]);

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

	const renderEstadoChip = (estado: 'Activo' | 'Anulado' | 'Procesado') => {
		let color: 'success' | 'error' | 'warning' = 'success';
		if (estado === 'Anulado') {
			color = 'error';
		} else if (estado === 'Procesado') {
			color = 'warning';
		}

		return (
			<Chip
				label={estado}
				size='small'
				color={color}
				sx={{
					'& .MuiChip-icon': {
						marginLeft: '8px',
						marginRight: '-4px',
						color: 'currentColor',
					},
				}}
			/>
		);
	};

	const isInitialLoading = isLoadingSimple && datosCombinados.length === 0;

	return (
		<Box sx={{ width: '100%' }}>
			<Box
				sx={{
					mt: 3,
					mb: 2,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant='h5' gutterBottom>
					Pagos
				</Typography>
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

			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer component={Paper} sx={{ maxHeight: 790 }} ref={containerRef}>
					<Table stickyHeader size='small' aria-label='tabla de pagos'>
						<TableHead>
							<TableRow>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'cliente'}
										direction={orderBy === 'cliente' ? order : 'asc'}
										onClick={createSortHandler('cliente')}
									>
										Cliente
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'tipoPago'}
										direction={orderBy === 'tipoPago' ? order : 'asc'}
										onClick={createSortHandler('tipoPago')}
									>
										Tipo de Pago
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'fecha'}
										direction={orderBy === 'fecha' ? order : 'asc'}
										onClick={createSortHandler('fecha')}
									>
										Creado
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
										active={orderBy === 'montoUSD'}
										direction={orderBy === 'montoUSD' ? order : 'asc'}
										onClick={createSortHandler('montoUSD')}
									>
										Monto (USD)
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'montoVES'}
										direction={orderBy === 'montoVES' ? order : 'asc'}
										onClick={createSortHandler('montoVES')}
									>
										Monto (VES)
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'referencia'}
										direction={orderBy === 'referencia' ? order : 'asc'}
										onClick={createSortHandler('referencia')}
									>
										Referencia
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'comentario'}
										direction={orderBy === 'comentario' ? order : 'asc'}
										onClick={createSortHandler('comentario')}
									>
										Comentario
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
							{isInitialLoading ? (
								<TableRow>
									<TableCell colSpan={9} align='center'>
										<CircularProgress size={40} sx={{ my: 2 }} />
									</TableCell>
								</TableRow>
							) : visibleData.length > 0 ? (
								<>
									{visibleData.map((pago) => (
										<TableRow
											key={pago._id}
											hover
											sx={{
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
												},
											}}
										>
											<TableCell>{pago.cliente || '-'}</TableCell>
											<TableCell>{pago.tipoPago || '-'}</TableCell>
											<TableCell>{pago.fecha || '-'}</TableCell>
											<TableCell>{pago.creadoPor || '-'}</TableCell>
											<TableCell>
												{pago.montoUSD !== undefined
													? pago.montoUSD.toFixed(2)
													: '-'}
											</TableCell>
											<TableCell>
												{Number(pago.montoVES).toFixed(2) + 'Bs' ||
													'-'}
											</TableCell>
											<TableCell>{pago.referencia || '-'}</TableCell>
											<TableCell>{pago.comentario || '-'}</TableCell>
											<TableCell>
												{pago.estado
													? renderEstadoChip(pago.estado)
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
										No hay pagos disponibles
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

export default TableLastPay;
