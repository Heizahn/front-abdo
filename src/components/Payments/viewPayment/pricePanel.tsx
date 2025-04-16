import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import {
	AttachMoney as MoneyIcon,
	Speed as SpeedIcon,
	Wallet as WalletIcon,
	Diamond as DiamondIcon,
} from '@mui/icons-material';

export default function PricePanel({ bcvData }) {
	// Verificar si tenemos datos válidos
	const dollarPrice = bcvData?.precio || 0;
	const fecha = bcvData?.fecha || 'No disponible';

	// Cálculo de precios (con 8%)
	const precioBasico = dollarPrice ? (20 * 1.08 * dollarPrice).toFixed(2) : '0.00';
	const precioEstandar = dollarPrice ? (25 * 1.08 * dollarPrice).toFixed(2) : '0.00';
	const premioPremium = dollarPrice ? (30 * 1.08 * dollarPrice).toFixed(2) : '0.00';

	return (
		<Card variant='outlined' sx={{ mb: 3 }}>
			<CardContent sx={{ p: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								height: '100%',
							}}
						>
							<Typography
								variant='subtitle2'
								color='text.secondary'
								gutterBottom
							>
								Precio del Dólar BCV
							</Typography>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									mt: 1,
								}}
							>
								<MoneyIcon color='primary' sx={{ mr: 1 }} />
								<Typography variant='h5' fontWeight='bold'>
									{dollarPrice.toFixed(4)} Bs
								</Typography>
							</Box>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ mt: 1 }}
							>
								Fecha: {fecha}
							</Typography>
						</Box>
					</Grid>

					<Divider
						orientation='vertical'
						flexItem
						sx={{ display: { xs: 'none', md: 'block' } }}
					/>

					<Grid item xs={12} md={8}>
						<Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
							Precios de Planes
						</Typography>
						<Grid container spacing={1}>
							<Grid item xs={4}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										p: 1,
										borderRadius: 1,
										bgcolor: 'action.hover',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
										<SpeedIcon
											fontSize='small'
											color='primary'
											sx={{ mr: 0.5 }}
										/>
										<Typography variant='subtitle2'>Básico</Typography>
									</Box>
									<Typography fontWeight='medium'>
										{precioBasico} Bs
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={4}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										p: 1,
										borderRadius: 1,
										bgcolor: 'action.hover',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
										<WalletIcon
											fontSize='small'
											color='primary'
											sx={{ mr: 0.5 }}
										/>
										<Typography variant='subtitle2'>Estándar</Typography>
									</Box>
									<Typography fontWeight='medium'>
										{precioEstandar} Bs
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={4}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										p: 1,
										borderRadius: 1,
										bgcolor: 'action.hover',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
										<DiamondIcon
											fontSize='small'
											color='primary'
											sx={{ mr: 0.5 }}
										/>
										<Typography variant='subtitle2'>Premium</Typography>
									</Box>
									<Typography fontWeight='medium'>
										{premioPremium} Bs
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
