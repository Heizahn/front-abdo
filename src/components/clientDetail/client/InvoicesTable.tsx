import React, { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	InputAdornment,
	TableSortLabel,
	CircularProgress,
	Typography,
	Button,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

// Define the Invoice interface based on your data
export interface Invoice {
	id: string;
	motivo: string;
	creado: string;
	monto: number;
	deuda: number;
	estado: 'Activo' | 'Anulado' | string;
}

interface InvoicesTableProps {
	invoices: Invoice[];
	isLoading?: boolean;
	onAddInvoice?: () => void;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Invoice;

const InvoicesTable: React.FC<InvoicesTableProps> = ({
	invoices,
	isLoading = false,
	onAddInvoice,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('creado');

	// Handle search input change
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Handle sort request
	const handleRequestSort = (property: OrderBy) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	// Create sort handler
	const createSortHandler = (property: OrderBy) => () => {
		handleRequestSort(property);
	};

	// Filter and sort invoices
	const filteredInvoices = invoices
		.filter(
			(invoice) =>
				invoice.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
				invoice.creado.toLowerCase().includes(searchTerm.toLowerCase()) ||
				invoice.estado.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			if (orderBy === 'monto' || orderBy === 'deuda') {
				return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
			} else {
				const valueA = String(a[orderBy]).toLowerCase();
				const valueB = String(b[orderBy]).toLowerCase();
				return order === 'asc'
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}
		});

	return (
		<Box sx={{ width: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					mb: 2,
					alignItems: 'center',
				}}
			>
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
				<Box>
					{onAddInvoice && (
						<Button
							variant='contained'
							color='primary'
							startIcon={<AddIcon />}
							onClick={onAddInvoice}
							size='small'
						>
							Agregar
						</Button>
					)}
				</Box>
			</Box>

			<TableContainer
				component={Paper}
				sx={{ maxHeight: 634, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}
			>
				<Table stickyHeader aria-label='invoices table'>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'motivo'}
									direction={orderBy === 'motivo' ? order : 'asc'}
									onClick={createSortHandler('motivo')}
								>
									Motivo
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'creado'}
									direction={orderBy === 'creado' ? order : 'asc'}
									onClick={createSortHandler('creado')}
								>
									Creado
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'monto'}
									direction={orderBy === 'monto' ? order : 'asc'}
									onClick={createSortHandler('monto')}
								>
									Monto
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'deuda'}
									direction={orderBy === 'deuda' ? order : 'asc'}
									onClick={createSortHandler('deuda')}
								>
									Deuda
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
								<TableCell colSpan={5} align='center'>
									<CircularProgress size={40} sx={{ my: 2 }} />
								</TableCell>
							</TableRow>
						) : filteredInvoices.length > 0 ? (
							filteredInvoices.map((invoice) => (
								<TableRow key={invoice.id} hover>
									<TableCell>{invoice.motivo}</TableCell>
									<TableCell>{invoice.creado}</TableCell>
									<TableCell align='right'>{invoice.monto}$</TableCell>
									<TableCell align='right'>{invoice.deuda}$</TableCell>
									<TableCell>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Box
												sx={{
													width: 10,
													height: 10,
													borderRadius: '50%',
													backgroundColor:
														invoice.estado === 'Activo'
															? 'success.main'
															: 'error.main',
													mr: 1,
												}}
											/>
											{invoice.estado}
										</Box>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align='center'>
									<Typography variant='body1' sx={{ py: 2 }}>
										No hay facturas disponibles
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default InvoicesTable;
