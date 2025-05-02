import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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
	Dialog,
	DialogContent,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useFetchData } from '../../hooks/useQuery';
import SimpleModalWrapper from '../common/ContainerForm';
import CreateServiceForm from './CreateService';
import ServiceDetail from './ServiceDetail';
import { TableRowClickHandler } from '../common/TableRowClickHandler';

// Define the Plan interface based on your API schema
interface Plan {
	id: string;
	sName: string;
	nAmount: number;
	nMBPS: number;
	sState: string;
	nClients?: number;
	creator: string;
	dCreation: string;
	editor: string;
	dEdition: string;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Plan;

const PlansTable: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('sName');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// State for detail view
	const [detailOpen, setDetailOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<Plan | null>(null);

	// Use TanStack Query to fetch data
	const { data: plans = [], isLoading } = useFetchData<Plan[]>('/plans', 'plans');

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

	// Filter and sort data
	const filteredPlans = useMemo(() => {
		return plans
			.filter(
				(plan) =>
					!searchTerm || // If no search term, include all
					safeIncludes(plan.sName, searchTerm) ||
					safeIncludes(plan.nAmount, searchTerm) ||
					safeIncludes(plan.sState, searchTerm),
			)
			.sort((a, b) => {
				if (orderBy === 'sName') {
					// Extraer el nombre base y la velocidad
					const getPlanInfo = (plan: Plan) => {
						const name = plan.sName || '';
						const mbps = plan.nMBPS || 0;
						return { name, mbps };
					};

					const planA = getPlanInfo(a);
					const planB = getPlanInfo(b);

					// Primero comparar por nombre
					const nameCompare = planA.name.localeCompare(planB.name);
					if (nameCompare !== 0) {
						return order === 'asc' ? nameCompare : -nameCompare;
					}

					// Si los nombres son iguales, comparar por velocidad
					return order === 'asc' ? planA.mbps - planB.mbps : planB.mbps - planA.mbps;
				}

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
	}, [plans, searchTerm, orderBy, order]);

	const visibleData = useMemo(() => {
		return filteredPlans.slice(0, visibleItems);
	}, [filteredPlans, visibleItems]);

	// Infinite scroll handling
	const handleScroll = useCallback(() => {
		if (!containerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
		if (scrollHeight - scrollTop - clientHeight < 200 && !isLoadingMore) {
			if (visibleItems < filteredPlans.length) {
				setIsLoadingMore(true);

				setTimeout(() => {
					setVisibleItems((prev) => Math.min(prev + 50, filteredPlans.length));
					setIsLoadingMore(false);
				}, 150);
			}
		}
	}, [visibleItems, filteredPlans.length, isLoadingMore]);

	useEffect(() => {
		const currentContainer = containerRef.current;
		if (currentContainer) {
			currentContainer.addEventListener('scroll', handleScroll);
			return () => {
				currentContainer.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	// Render status indicator
	const renderEstado = (estado: string) => {
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

	// Handle row click to open detail view
	const handleRowClick = (plan: Plan) => {
		setSelectedService(plan);
		setDetailOpen(true);
	};

	// Handle close of detail view
	const handleDetailClose = () => {
		setDetailOpen(false);
		setSelectedService(null);
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
					Servicios
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<SimpleModalWrapper
						triggerButtonText='Crear Servicio'
						triggerButtonColor='primary'
						showCloseButton={false}
					>
						<CreateServiceForm />
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
					<Table stickyHeader size='small' aria-label='tabla de servicios'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontSize: 16, fontWeight: 'bold' }}>
									<TableSortLabel
										active={orderBy === 'sName'}
										direction={orderBy === 'sName' ? order : 'asc'}
										onClick={createSortHandler('sName')}
									>
										Nombre
									</TableSortLabel>
								</TableCell>
								<TableCell sx={{ fontSize: 16, fontWeight: 'bold' }}>
									<TableSortLabel
										active={orderBy === 'nAmount'}
										direction={orderBy === 'nAmount' ? order : 'asc'}
										onClick={createSortHandler('nAmount')}
									>
										Costo
									</TableSortLabel>
								</TableCell>
								<TableCell sx={{ fontSize: 16, fontWeight: 'bold' }}>
									<TableSortLabel
										active={orderBy === 'nClients'}
										direction={orderBy === 'nClients' ? order : 'asc'}
										onClick={createSortHandler('nClients')}
									>
										Clientes
									</TableSortLabel>
								</TableCell>

								<TableCell sx={{ fontSize: 16, fontWeight: 'bold' }}>
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
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={5} align='center'>
										<CircularProgress size={40} sx={{ my: 2 }} />
									</TableCell>
								</TableRow>
							) : visibleData.length > 0 ? (
								<>
									{visibleData.map((plan) => (
										<TableRowClickHandler
											key={plan.id}
											onRowClick={() => handleRowClick(plan)}
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
											<TableCell>
												{plan.sName && plan.nMBPS
													? `${plan.sName} (${
															plan.nMBPS.toString().length < 2
																? '0' + plan.nMBPS.toString()
																: plan.nMBPS.toString()
													  } Mbps)`
													: '-'}
											</TableCell>
											<TableCell>
												{plan.nAmount !== undefined
													? `${plan.nAmount}`
													: '-'}
											</TableCell>
											<TableCell>{plan.nClients ?? '-'}</TableCell>

											<TableCell>
												{plan.sState ? renderEstado(plan.sState) : '-'}
											</TableCell>
										</TableRowClickHandler>
									))}

									{isLoadingMore && (
										<TableRow>
											<TableCell
												colSpan={5}
												align='center'
												sx={{ py: 2 }}
											>
												<CircularProgress size={30} />
											</TableCell>
										</TableRow>
									)}

									{visibleItems >= filteredPlans.length &&
										filteredPlans.length > 100 && (
											<TableRow>
												<TableCell
													colSpan={5}
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
									<TableCell colSpan={5} align='center'>
										No hay servicios disponibles
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Service Detail Dialog */}
			<Dialog open={detailOpen} onClose={handleDetailClose} maxWidth='sm' fullWidth>
				<DialogContent>
					{selectedService && (
						<ServiceDetail
							serviceData={selectedService}
							onClose={handleDetailClose}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default PlansTable;
