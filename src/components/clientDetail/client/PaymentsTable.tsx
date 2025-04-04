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
	IconButton,
	Tooltip,
	TextField,
	InputAdornment,
	TableSortLabel,
	CircularProgress,
	Typography,
} from '@mui/material';
import {
	Search as SearchIcon,
	SendRounded as SendIcon,
	DownloadRounded as DownloadIcon,
	Add as AddIcon,
} from '@mui/icons-material';
import { Pago } from '../../../interfaces/InterfacesClientDetails';
import Pay from '../../common/Pay';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import SimpleModalWrapper from '../../common/ContainerForm';
interface PaymentsTableProps {
	payments: Pago[];
	isLoading?: boolean;
	isSending?: boolean;
	onSendPayment?: (id: Pago['_id']) => void;
}

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Pago | 'montoVES' | 'montoUSD';

const PaymentsTable: React.FC<PaymentsTableProps> = ({
	payments,
	isLoading = false,
	isSending = false,
	onSendPayment,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<OrderBy>('fecha');

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

	// Filter and sort payments
	const filteredPayments = payments
		.filter(
			(payment) =>
				payment.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.creadoPor.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.tipoPago.toLowerCase().includes(searchTerm.toLowerCase()) ||
				payment.estado.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			if (orderBy === 'montoUSD' || orderBy === 'montoVES') {
				return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
			} else {
				const valueA = String(a[orderBy as keyof Pago]).toLowerCase();
				const valueB = String(b[orderBy as keyof Pago]).toLowerCase();
				return order === 'asc'
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}
		});

	// Format currency
	const formatCurrency = (value: number, currency: string) => {
		if (currency === 'VES') {
			return `${value.toFixed(2)}Bs`;
		}
		return `${value.toFixed(2)}$`;
	};

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
							clientesId={client?.id as string}
							clientName={client?.nombre as string}
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
									active={orderBy === 'motivo'}
									direction={orderBy === 'motivo' ? order : 'asc'}
									onClick={createSortHandler('motivo')}
								>
									Motivo
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
									active={orderBy === 'recibidoPor'}
									direction={orderBy === 'recibidoPor' ? order : 'asc'}
									onClick={createSortHandler('recibidoPor')}
								>
									Recibido Por
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
								<TableSortLabel
									active={orderBy === 'montoUSD'}
									direction={orderBy === 'montoUSD' ? order : 'asc'}
									onClick={createSortHandler('montoUSD')}
								>
									Monto (USD)
								</TableSortLabel>
							</TableCell>
							<TableCell align='right'>
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
									active={orderBy === 'estado'}
									direction={orderBy === 'estado' ? order : 'asc'}
									onClick={createSortHandler('estado')}
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
								<TableRow key={payment._id} hover>
									<TableCell>{payment.motivo}</TableCell>
									<TableCell>{payment.tipoPago}</TableCell>
									<TableCell>{payment.fecha}</TableCell>
									<TableCell>{payment.creadoPor}</TableCell>
									<TableCell>{payment.recibidoPor}</TableCell>
									<TableCell align='right'>{payment.montoUSD}$</TableCell>
									<TableCell align='right'>
										{formatCurrency(payment.montoVES, 'VES')}
									</TableCell>
									<TableCell>{payment.referencia}</TableCell>
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
														payment.estado === 'Activo'
															? 'success.main'
															: 'error.main',
													mr: 1,
												}}
											/>
											{payment.estado}
										</Box>
									</TableCell>
									<TableCell align='center'>
										<Box
											sx={{ display: 'flex', justifyContent: 'center' }}
										>
											<Tooltip title='Enviar Pago'>
												<IconButton
													color='primary'
													onClick={() =>
														onSendPayment &&
														onSendPayment(payment._id)
													}
													size='small'
													disabled={isSending}
												>
													<SendIcon />
												</IconButton>
											</Tooltip>

											<Tooltip title='Coming soon'>
												<IconButton size='small' color='primary'>
													<DownloadIcon />
												</IconButton>
											</Tooltip>
										</Box>
									</TableCell>
								</TableRow>
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
		</Box>
	);
};

export default PaymentsTable;
