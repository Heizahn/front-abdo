import {
	CardContent,
	Chip,
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
	LocalAtm as LocalAtmIcon,
	AccountBalance as AccountBalanceIcon,
	AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { IPaymentHistory } from '../../../interfaces/Interfaces';
import { formatDate } from '../../../services/formaterDate';

const PaymentHistory = ({ pagos = [] }: { pagos: IPaymentHistory[] }) => {
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
			<CardContent sx={{ paddingTop: 0 }}>
				<Typography
					variant='body2'
					color='text.secondary'
					align='center'
					sx={{ py: 2 }}
				>
					No hay pagos registrados para este cliente.
				</Typography>
			</CardContent>
		);
	}

	return (
		<CardContent sx={{ paddingTop: 0 }}>
			<TableContainer component={Paper} variant='outlined'>
				<Table size='small'>
					<TableHead>
						<TableRow sx={{ bgcolor: 'primary.light' }}>
							<TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Referencia</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Monto (USD)
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Monto (VES)
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pagos.map((pago, index) => (
							<TableRow
								key={index}
								sx={{
									minHeight: 37,
									height: 37,
									maxHeight: 37,
									paddingY: 1,
								}}
							>
								<TableCell component='th' scope='row'>
									{formatDate(pago.dCreation)}
								</TableCell>
								<TableCell>
									<Tooltip title={pago.bCash ? 'Efectivo' : 'Digital'}>
										<Chip
											icon={getPaymentIcon(
												pago.bCash ? 'Efectivo' : 'Digital',
											)}
											label={pago.bCash ? 'Efectivo' : 'Digital'}
											size='small'
											variant='outlined'
											color='primary'
										/>
									</Tooltip>
								</TableCell>
								<TableCell>{pago.sReason || 'Sin motivo'}</TableCell>
								<TableCell>{pago.sReference || 'N/A'}</TableCell>
								<TableCell align='right'>
									<Typography
										variant='body2'
										fontWeight='medium'
										color='primary.dark'
									>
										{pago.nAmount || '0'}
									</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography variant='body2' color='text.secondary'>
										{pago.nBs || '0'} Bs.
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</CardContent>
	);
};

export default PaymentHistory;
