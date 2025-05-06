import React, { useRef, useState } from 'react';
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
import SimpleModalWrapper from '../../../common/ContainerForm';
import CreateInvoice from './CreateInvoice';
import { useParams } from 'react-router-dom';
import { Factura } from '../../../../interfaces/InterfacesClientDetails';
import InvoiceDetails from './InvoiceDetails';
import { TableRowClickHandler } from '../../../common/TableRowClickHandler';

interface InvoicesTableProps {
	invoices: Factura[];
	isLoading?: boolean;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Factura;

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, isLoading = false }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('dCreation');
	const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
	const modalTriggerRef = useRef<HTMLButtonElement>(null);
	const { id } = useParams();

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
	// Handle row click to show details
	const handleRowClick = (invoice: Factura) => {
		setSelectedInvoice(invoice);
		// Activar programáticamente el modal después de que el estado se actualice
		setTimeout(() => {
			if (modalTriggerRef.current) {
				modalTriggerRef.current.click();
			}
		}, 0);
	};

	// Filter and sort invoices
	const filteredInvoices = invoices
		.filter(
			(invoice) =>
				invoice.sReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
				invoice.dCreation.toLowerCase().includes(searchTerm.toLowerCase()) ||
				invoice.sState.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			if (orderBy === 'nAmount' || orderBy === 'debt') {
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
				<SimpleModalWrapper
					triggerButtonText='Agregar'
					showCloseButton={false}
					size='small'
					icon={<AddIcon />}
				>
					<CreateInvoice clientId={id as string} onCancel={() => {}} />
				</SimpleModalWrapper>
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
									active={orderBy === 'sReason'}
									direction={orderBy === 'sReason' ? order : 'asc'}
									onClick={createSortHandler('sReason')}
								>
									Motivo
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'dCreation'}
									direction={orderBy === 'dCreation' ? order : 'asc'}
									onClick={createSortHandler('dCreation')}
								>
									Creado
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'nAmount'}
									direction={orderBy === 'nAmount' ? order : 'asc'}
									onClick={createSortHandler('nAmount')}
								>
									Monto
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'debt'}
									direction={orderBy === 'debt' ? order : 'asc'}
									onClick={createSortHandler('debt')}
								>
									Deuda
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
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={6} align='center'>
									<CircularProgress size={40} sx={{ my: 2 }} />
								</TableCell>
							</TableRow>
						) : filteredInvoices.length > 0 ? (
							filteredInvoices.map((invoice) => (
								<TableRowClickHandler
									key={invoice.id}
									onRowClick={() => handleRowClick(invoice)}
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
									<TableCell>{invoice.sReason}</TableCell>
									<TableCell>{invoice.dCreation}</TableCell>
									<TableCell align='right'>
										{(invoice.nAmount || 0).toFixed(2)}
									</TableCell>
									<TableCell
										align='right'
										sx={{ color: invoice.debt > 0 ? 'red' : 'inherit' }}
									>
										{(invoice.debt || 0).toFixed(2)}
									</TableCell>
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
														invoice.sState === 'Activo'
															? 'success.main'
															: 'error.main',
													mr: 1,
												}}
											/>
											{invoice.sState}
										</Box>
									</TableCell>
								</TableRowClickHandler>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} align='center'>
									<Typography variant='body1' sx={{ py: 2 }}>
										No hay facturas disponibles
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Botón oculto que sirve como trigger para el SimpleModalWrapper */}
			<div style={{ display: 'none' }}>
				<Button ref={modalTriggerRef} id='hidden-modal-trigger'>
					Trigger
				</Button>
			</div>

			{/* Modal para mostrar detalles de la factura - Solo se renderiza cuando hay una factura seleccionada */}
			{selectedInvoice && (
				<SimpleModalWrapper
					showCloseButton={false}
					triggerComponent={
						<span id='modal-trigger-element' ref={modalTriggerRef} />
					}
					maxWidth='md'
				>
					<InvoiceDetails invoice={selectedInvoice} />
				</SimpleModalWrapper>
			)}
		</Box>
	);
};

export default InvoicesTable;
