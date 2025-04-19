import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Collapse,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	Receipt as ReceiptIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
	KeyboardArrowUp as KeyboardArrowUpIcon,
	LocalAtm as LocalAtmIcon,
	AccountBalance as AccountBalanceIcon,
	AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { IPaymentHistory } from '../../../interfaces/Interfaces';

const PaymentHistory = ({ pagos = [] }: { pagos: IPaymentHistory[] }) => {
	const [open, setOpen] = useState(true);

	// Función para determinar el icono según el tipo de pago
	const getPaymentIcon = (tipoPago: string) => {
		switch (tipoPago) {
			case 'Efectivo':
				return <LocalAtmIcon fontSize='small' />;
			case 'Digital':
				return <AccountBalanceIcon fontSize='small' />;
			default:
				return <AttachMoneyIcon fontSize='small' />;
		}
	};

	// Si no hay pagos, mostramos un mensaje
	if (!pagos || pagos.length === 0) {
		return (
			<Card>
				<CardHeader
					title={
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
							<Typography variant='h6'>Historial de Pagos</Typography>
						</Box>
					}
					action={
						<IconButton
							onClick={() => setOpen(!open)}
							aria-label='mostrar/ocultar'
							size='small'
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					}
				/>
				<Collapse in={open}>
					<CardContent>
						<Typography
							variant='body2'
							color='text.secondary'
							align='center'
							sx={{ py: 2 }}
						>
							No hay pagos registrados para este cliente.
						</Typography>
					</CardContent>
				</Collapse>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader
				title={
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
						<Typography variant='h6'>Últimos Pagos</Typography>
					</Box>
				}
				action={
					<IconButton
						onClick={() => setOpen(!open)}
						aria-label='mostrar/ocultar'
						size='small'
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				}
			/>
			<Collapse in={open}>
				<CardContent>
					<TableContainer component={Paper} variant='outlined'>
						<Table size='small'>
							<TableHead>
								<TableRow sx={{ bgcolor: 'primary.light' }}>
									<TableCell>Fecha</TableCell>
									<TableCell>Tipo</TableCell>
									<TableCell>Referencia</TableCell>
									<TableCell>Motivo</TableCell>
									<TableCell align='right'>Monto (USD)</TableCell>
									<TableCell align='right'>Monto (VES)</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{pagos.map((pago, index) => (
									<TableRow
										key={index}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
										}}
									>
										<TableCell component='th' scope='row'>
											{pago.fecha}
										</TableCell>
										<TableCell>
											<Tooltip
												title={pago.tipoPago || 'No especificado'}
											>
												<Chip
													icon={getPaymentIcon(pago.tipoPago)}
													label={pago.tipoPago || 'N/A'}
													size='small'
													variant='outlined'
													color='primary'
												/>
											</Tooltip>
										</TableCell>
										<TableCell>{pago.referencia || 'N/A'}</TableCell>
										<TableCell>{pago.motivo || 'Sin motivo'}</TableCell>
										<TableCell align='right'>
											<Typography
												variant='body2'
												fontWeight='medium'
												color='primary.dark'
											>
												${pago.monto?.toFixed(2) || '0.00'}
											</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='body2' color='text.secondary'>
												{pago.montoVES?.toFixed(2) || '0.00'} Bs.
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default PaymentHistory;
