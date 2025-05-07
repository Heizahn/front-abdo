import React, { useState, useRef } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Tooltip,
	TextField,
	InputAdornment,
	TableSortLabel,
	CircularProgress,
	Typography,
	Button,
} from '@mui/material';
import {
	Search as SearchIcon,
	DownloadRounded as DownloadIcon,
	Add as AddIcon,
} from '@mui/icons-material';
import { Pago } from '../../../../interfaces/InterfacesClientDetails';
import Pay from '../../../common/Pay';
import { useClientDetailsContext } from '../../../../context/ClientDetailContext';
import SimpleModalWrapper from '../../../common/ContainerForm';
import PaymentDetails from './PaymentDetails';
import SendPay from './SendPay';
import { TableRowClickHandler } from '../../../common/TableRowClickHandler';

interface PaymentsTableProps {
	payments: Pago[];
	isLoading?: boolean;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Pago | 'montoVES' | 'montoUSD';

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, isLoading = false }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('dCreation');
	const [selectedPayment, setSelectedPayment] = useState<Pago | null>(null);
	const modalTriggerRef = useRef<HTMLButtonElement>(null);

	const { client } = useClientDetailsContext();

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
	const handleRowClick = (payment: Pago) => {
		setSelectedPayment(payment);
		// Activar programáticamente el modal después de que el estado se actualice

		if (modalTriggerRef.current) {
			modalTriggerRef.current.click();
		}
	};

	// Filter and sort payments
	const filteredPayments = payments
		.filter(
			(payment) =>
				payment.sReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.dCreation.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.sReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.sState.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			if (orderBy === 'nAmount' || orderBy === 'nBs') {
				return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
			} else {
				const valueA = String(a[orderBy as keyof Pago]).toLowerCase();
				const valueB = String(b[orderBy as keyof Pago]).toLowerCase();
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
					<SimpleModalWrapper
						triggerButtonText='Agregar'
						triggerButtonColor='primary'
						showCloseButton={false}
						size='small'
						icon={<AddIcon />}
					>
						<Pay
							clientId={client?.id as string}
							clientName={client?.sName as string}
							onCancel={() => {}}
						/>
					</SimpleModalWrapper>
				</Box>
			</Box>

			<TableContainer
				component={Paper}
				sx={{ maxHeight: 634, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}
			>
				<Table stickyHeader aria-label='payments table'>
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
							{/* <TableCell>
								<TableSortLabel
									active={orderBy === 'receiver'}
									direction={orderBy === 'receiver' ? order : 'asc'}
									onClick={createSortHandler('receiver')}
								>
									Recibido Por
								</TableSortLabel>
							</TableCell> */}
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'nAmount'}
									direction={orderBy === 'nAmount' ? order : 'asc'}
									onClick={createSortHandler('nAmount')}
								>
									Monto (USD)
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
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
									active={orderBy === 'sState'}
									direction={orderBy === 'sState' ? order : 'asc'}
									onClick={createSortHandler('sState')}
								>
									Estado
								</TableSortLabel>
							</TableCell>
							<TableCell align='center'>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={10} align='center'>
									<CircularProgress size={40} sx={{ my: 2 }} />
								</TableCell>
							</TableRow>
						) : filteredPayments.length > 0 ? (
							filteredPayments.map((payment) => (
								<TableRowClickHandler
									key={payment.id}
									onRowClick={() => handleRowClick(payment)}
									sx={{
										cursor: 'pointer',
										minHeight: 37,
										height: 37,
										maxHeight: 37,
										paddingY: 1,
										'&:hover': {
											backgroundColor: 'rgba(0, 0, 0, 0.04)',
										},
									}}
								>
									<TableCell>{payment.sReason}</TableCell>
									<TableCell>
										{payment.bCash ? 'Efectivo' : 'Digital'}
									</TableCell>
									<TableCell>{payment.dCreation}</TableCell>
									<TableCell>{payment.creator?.toUpperCase()}</TableCell>
									{/* <TableCell>{payment.receiver}</TableCell> */}
									<TableCell align='right'>{payment.nAmount}</TableCell>
									<TableCell align='right'>{payment.nBs}</TableCell>
									<TableCell>{payment.sReference}</TableCell>
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
														payment.sState === 'Activo'
															? 'success.main'
															: 'error.main',
													mr: 1,
												}}
											/>
											{payment.sState}
										</Box>
									</TableCell>
									<TableCell align='center'>
										<Box
											sx={{ display: 'flex', justifyContent: 'center' }}
											onClick={(e) => e.stopPropagation()}
										>
											<SendPay paymentId={payment.id} />
											<Tooltip title='Descargar recibo'>
												<IconButton
													size='small'
													color='primary'
													disabled
												>
													<DownloadIcon />
												</IconButton>
											</Tooltip>
										</Box>
									</TableCell>
								</TableRowClickHandler>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align='center'>
									<Typography variant='body1' sx={{ py: 2 }}>
										No hay pagos registrados
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

			{/* Modal para mostrar detalles del pago - Solo se renderiza cuando hay un pago seleccionado */}
			{selectedPayment && (
				<SimpleModalWrapper
					showCloseButton={false}
					triggerComponent={
						<span id='modal-trigger-element' ref={modalTriggerRef} />
					}
					maxWidth='md'
				>
					<PaymentDetails payment={selectedPayment} />
				</SimpleModalWrapper>
			)}
		</Box>
	);
};

export default PaymentsTable;
