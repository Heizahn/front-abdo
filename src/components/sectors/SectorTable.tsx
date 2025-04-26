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
import SectorDetail from './SectorDetail'; // Import the detail component we'll create
import SimpleModalWrapper from '../common/ContainerForm';
import CreateSectorForm from './CreateSector';
import { useFetchData } from '../../hooks/useQuery';
import { TableRowClickHandler } from '../common/TableRowClickHandler';

// Define the Sector interface based on your API schema
interface Sector {
	_id: string;
	nombre: string;
	estado: string;
	creadoPor: string;
	clientes?: number;
	editadoPor?: string;
	fechaCreacion: string;
	fechaEdicion?: string;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Sector;

const SectorsTable: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('nombre');
	const [visibleItems, setVisibleItems] = useState(100);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// State for detail view
	const [detailOpen, setDetailOpen] = useState(false);
	const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

	// Use TanStack Query to fetch data
	const { data: sectors = [], isLoading } = useFetchData<Sector[]>(
		'/sectorsList',
		'sectorsList',
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

	// Filter and sort data
	const filteredSectors = useMemo(() => {
		return sectors
			.filter(
				(sector) =>
					!searchTerm || // If no search term, include all
					safeIncludes(sector.nombre, searchTerm) ||
					safeIncludes(sector.estado, searchTerm),
			)
			.sort((a, b) => {
				const valueA = a[orderBy];
				const valueB = b[orderBy];

				if (valueA == null && valueB == null) return 0;
				if (valueA == null) return order === 'asc' ? -1 : 1;
				if (valueB == null) return order === 'asc' ? 1 : -1;

				// Manejo especial para el campo 'clientes'
				if (orderBy === 'clientes') {
					const numA = Number(valueA) || 0;
					const numB = Number(valueB) || 0;
					return order === 'asc' ? numA - numB : numB - numA;
				}

				// Para otros campos, mantener el ordenamiento alfabético
				const strA = String(valueA).toLowerCase();
				const strB = String(valueB).toLowerCase();
				return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
			});
	}, [sectors, searchTerm, orderBy, order]);

	const visibleData = useMemo(() => {
		return filteredSectors.slice(0, visibleItems);
	}, [filteredSectors, visibleItems]);

	// Infinite scroll handling
	const handleScroll = useCallback(() => {
		if (!containerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
		if (scrollHeight - scrollTop - clientHeight < 200 && !isLoadingMore) {
			if (visibleItems < filteredSectors.length) {
				setIsLoadingMore(true);

				setTimeout(() => {
					setVisibleItems((prev) => Math.min(prev + 50, filteredSectors.length));
					setIsLoadingMore(false);
				}, 150);
			}
		}
	}, [visibleItems, filteredSectors.length, isLoadingMore]);

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

	// Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: 'numeric',
		});
	};

	// Handle row click to open detail view
	const handleRowClick = (sector: Sector) => {
		setSelectedSector(sector);
		setDetailOpen(true);
	};

	// Handle close of detail view
	const handleDetailClose = () => {
		setDetailOpen(false);
		setSelectedSector(null);
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
					Sectores
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<SimpleModalWrapper
						triggerButtonText='Crear Sector'
						triggerButtonColor='primary'
						showCloseButton={false}
					>
						<CreateSectorForm />
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
					<Table stickyHeader size='small' aria-label='tabla de sectores'>
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
										active={orderBy === 'fechaCreacion'}
										direction={orderBy === 'fechaCreacion' ? order : 'asc'}
										onClick={createSortHandler('fechaCreacion')}
									>
										Fecha de Creación
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
									<TableCell colSpan={4} align='center'>
										<CircularProgress size={40} sx={{ my: 2 }} />
									</TableCell>
								</TableRow>
							) : visibleData.length > 0 ? (
								<>
									{visibleData.map((sector) => (
										<TableRowClickHandler
											key={sector._id}
											onRowClick={() => handleRowClick(sector)}
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
											<TableCell component='th' scope='row'>
												{sector.nombre || '-'}
											</TableCell>
											<TableCell>
												{sector.fechaCreacion
													? formatDate(sector.fechaCreacion)
													: '-'}
											</TableCell>
											<TableCell>{sector.clientes || 0}</TableCell>
											<TableCell>
												{sector.estado
													? renderEstado(sector.estado)
													: '-'}
											</TableCell>
										</TableRowClickHandler>
									))}

									{isLoadingMore && (
										<TableRow>
											<TableCell
												colSpan={4}
												align='center'
												sx={{ py: 2 }}
											>
												<CircularProgress size={30} />
											</TableCell>
										</TableRow>
									)}

									{visibleItems >= filteredSectors.length &&
										filteredSectors.length > 100 && (
											<TableRow>
												<TableCell
													colSpan={4}
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
									<TableCell colSpan={4} align='center'>
										No hay sectores disponibles
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Sector Detail Dialog */}
			<Dialog open={detailOpen} onClose={handleDetailClose} maxWidth='sm' fullWidth>
				<DialogContent>
					{selectedSector && (
						<SectorDetail
							sectorData={selectedSector}
							onClose={handleDetailClose}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SectorsTable;
