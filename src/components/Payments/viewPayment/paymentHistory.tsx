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
							<TableCell sx={{ fontWeight: 'bold' }}>Referencia</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
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
									{pago.fecha}
								</TableCell>
								<TableCell>
									<Tooltip title={pago.tipoPago || 'No especificado'}>
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
										{pago.monto?.toFixed(2) || '0.00'}
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
	);
};

export default PaymentHistory;
