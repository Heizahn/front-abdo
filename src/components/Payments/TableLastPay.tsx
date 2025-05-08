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
import PaymentDetails from '../clientDetail/client/payments/PaymentDetails';
import { TableRowClickHandler } from '../common/TableRowClickHandler';
import { Pago } from '../../interfaces/InterfacesClientDetails';
import { useBuildParams } from '../../hooks/useBuildParams';

interface IPaymentView extends Pago {
	clientName: string;
	clientId: string;
}

// Props para el componente
interface TableLastPayProps {
	pagosSimpleData: IPaymentView[];
	isLoadingSimple: boolean;
}

// Tipo para ordenar
type Order = 'asc' | 'desc';
type OrderBy = keyof IPaymentView;

const TableLastPay: React.FC<TableLastPayProps> = ({ pagosSimpleData, isLoadingSimple }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('dCreation');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: pagosCompletosData = [] } = useFetchData<IPaymentView[]>(
		'/payments/list/complete' + useBuildParams(),
		'paysList',
	);
	const [datosCombinados, setDatosCombinados] = useState<IPaymentView[]>([]);
	const [selectedPayment, setSelectedPayment] = useState<IPaymentView | null>(null);
	const modalTriggerRef = useRef<HTMLButtonElement>(null);

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

	const safeIncludes = (
		value: string | number | null | undefined,
		searchString: string,
	): boolean => {
		if (value == null) return false;
		return String(value).toLowerCase().includes(searchString.toLowerCase());
	};

	// Handle row click to show details
	const handleRowClick = (payment: IPaymentView) => {
		setSelectedPayment(payment);
		// Activar programáticamente el modal después de que el estado se actualice
		setTimeout(() => {
			if (modalTriggerRef.current) {
				modalTriggerRef.current.click();
			}
		}, 0);
	};

	const filteredPagos = useMemo(() => {
		if (!searchTerm && orderBy === 'dCreation' && order === 'desc') {
			return datosCombinados;
		}

		return datosCombinados
			.filter(
				(pago) =>
					!searchTerm || // Si no hay término de búsqueda, incluir todos
					safeIncludes(pago.clientName, searchTerm) ||
					safeIncludes(pago.sReason, searchTerm) ||
					safeIncludes(pago.dCreation, searchTerm) ||
					safeIncludes(pago.creator, searchTerm) ||
					safeIncludes(pago.sReference, searchTerm) ||
					safeIncludes(pago.sCommentary, searchTerm) ||
					safeIncludes(pago.sState, searchTerm),
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

	const isInitialLoading = isLoadingSimple && datosCombinados.length === 0;

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
					Pagos
				</Typography>
				{/* Modal para mostrar detalles del pago - Solo se renderiza cuando hay un pago seleccionado */}
				{selectedPayment && (
					<SimpleModalWrapper
						showCloseButton={false}
						triggerComponent={
							<span id='modal-trigger-element' ref={modalTriggerRef} />
						}
						maxWidth='md'
					>
						<PaymentDetails
							payment={selectedPayment}
							clientName={selectedPayment.clientName}
							clientId={selectedPayment.clientId}
						/>
					</SimpleModalWrapper>
				)}
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
				<TableContainer sx={{ maxHeight: 820 }} ref={containerRef}>
					<Table stickyHeader size='small' aria-label='tabla de pagos'>
						<TableHead>
							<TableRow>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'clientName'}
										direction={orderBy === 'clientName' ? order : 'asc'}
										onClick={createSortHandler('clientName')}
									>
										Cliente
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'sReason'}
										direction={orderBy === 'sReason' ? order : 'asc'}
										onClick={createSortHandler('sReason')}
									>
										Motivo
									</TableSortLabel>
								</TableCell>
								<TableCell>Tipo de Pago</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'dCreation'}
										direction={orderBy === 'dCreation' ? order : 'asc'}
										onClick={createSortHandler('dCreation')}
									>
										Creado
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'creator'}
										direction={orderBy === 'creator' ? order : 'asc'}
										onClick={createSortHandler('creator')}
									>
										Creado Por
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'nAmount'}
										direction={orderBy === 'nAmount' ? order : 'asc'}
										onClick={createSortHandler('nAmount')}
									>
										Monto (USD)
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'nBs'}
										direction={orderBy === 'nBs' ? order : 'asc'}
										onClick={createSortHandler('nBs')}
									>
										Monto (VES)
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'sReference'}
										direction={orderBy === 'sReference' ? order : 'asc'}
										onClick={createSortHandler('sReference')}
									>
										Referencia
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'sCommentary'}
										direction={orderBy === 'sCommentary' ? order : 'asc'}
										onClick={createSortHandler('sCommentary')}
									>
										Comentario
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === 'sState'}
										direction={orderBy === 'sState' ? order : 'asc'}
										onClick={createSortHandler('sState')}
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
										<TableRowClickHandler
											key={pago.id}
											onRowClick={() => handleRowClick(pago)}
											sx={{
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
												},
												'&:nth-of-type(odd)': {
													backgroundColor: 'rgba(0, 0, 0, 0.02)',
												},
											}}
										>
											<TableCell>{pago.clientName || '-'}</TableCell>
											<TableCell>{pago.sReason || '-'}</TableCell>
											<TableCell>
												{pago.bCash ? 'Efectivo' : 'Digital'}
											</TableCell>
											<TableCell>{pago.dCreation || '-'}</TableCell>
											<TableCell>{pago.creator || '-'}</TableCell>
											<TableCell>{pago.nAmount || '-'}</TableCell>
											<TableCell>{pago.nBs || '-'}</TableCell>
											<TableCell>{pago.sReference || '-'}</TableCell>
											<TableCell>{pago.sCommentary || '-'}</TableCell>
											<TableCell>
												{pago.sState
													? renderEstadoChip(pago.sState)
													: '-'}
											</TableCell>
										</TableRowClickHandler>
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
		</>
	);
};

export default TableLastPay;
