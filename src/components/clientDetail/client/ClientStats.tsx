// src/components/clientDetail/client/ClientStats.tsx
import { useMemo } from 'react';
import {
	Box,
	Typography,
	Paper,
	Grid,
	Card,
	CardContent,
	CircularProgress,
} from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import { useFetchData } from '../../../hooks/useQuery';
import { useParams } from 'react-router-dom';

// Interfaz para los datos del endpoint de tipos de pago
interface TipoPagoStat {
	_id: string;
	count: number;
	tipo: string;
}

const ClientStats = () => {
	const { client, loading: clientLoading, error: clientError } = useClientDetailsContext();
	const { id } = useParams<{ id: string }>();

	// Usando el hook useFetchData para obtener los datos de tipos de pago
	const {
		data: tiposPagoData,
		isLoading: tiposLoading,
		error: tiposError,
	} = useFetchData<TipoPagoStat[]>(`/paysPieChart0/${id}`, 'paysPieChart0-' + id);

	// Colores para las gráficas
	const COLORS = ['#1976d2', '#ed6c02'];

	// Generar datos para el gráfico de barras a partir de pagosTabla
	const barChartData = useMemo(() => {
		if (!client?.pagosTabla || client.pagosTabla.length === 0) return [];

		// Contar pagos por día
		const pagosPorDia: Record<string, number> = {};

		client.pagosTabla.forEach((pago) => {
			// Extraer el día del mes de la fecha de pago
			const fechaPago = new Date(pago.fecha);
			const dia = fechaPago.getDate().toString();

			// Incrementar contador para ese día
			pagosPorDia[dia] = (pagosPorDia[dia] || 0) + 1;
		});

		// Convertir a formato para gráfico
		return Object.entries(pagosPorDia)
			.map(([dia, pagos]) => ({ dia, pagos }))
			.sort((a, b) => parseInt(a.dia) - parseInt(b.dia));
	}, [client?.pagosTabla]);

	// Generar datos para el gráfico de pie a partir de tiposPagoData
	const pieChartData = useMemo(() => {
		if (!tiposPagoData) return [];

		return tiposPagoData.map((item: { tipo: any; count: any }) => ({
			name: item.tipo,
			value: item.count,
		}));
	}, [tiposPagoData]);

	// Calcular totales y porcentajes
	const stats = useMemo(() => {
		if (!tiposPagoData || !client?.pagosTabla) {
			return {
				totalPagos: 0,
				totalUSD: 0,
				totalVES: 0,
				montoTotalUSD: 0,
				percentages: {},
			};
		}

		// Calcular totales
		const totalPagos = client.pagosTabla.length;
		const usdPayments =
			tiposPagoData.find((item: { tipo: string }) => item.tipo === 'USD')?.count || 0;
		const vesPayments =
			tiposPagoData.find((item: { tipo: string }) => item.tipo === 'VES')?.count || 0;

		// Calcular monto total en USD
		const montoTotalUSD = client.pagosTabla.reduce(
			(sum, pago) => sum + (pago.montoUSD || 0),
			0,
		);

		// Calcular porcentajes para el gráfico
		const total = usdPayments + vesPayments;
		const percentages: Record<string, number> = {};

		if (total > 0) {
			percentages['USD'] = parseFloat(((usdPayments / total) * 100).toFixed(1));
			percentages['VES'] = parseFloat(((vesPayments / total) * 100).toFixed(1));
		}

		return {
			totalPagos,
			totalUSD: usdPayments,
			totalVES: vesPayments,
			montoTotalUSD,
			percentages,
		};
	}, [client?.pagosTabla, tiposPagoData]);

	// Mostrar loader mientras se cargan los datos
	if (clientLoading || tiposLoading) {
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					textAlign: 'center',
					minHeight: '300px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Mostrar error si ocurre
	if (clientError || tiposError) {
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					textAlign: 'center',
				}}
			>
				<Typography color='error'>{clientError || tiposError}</Typography>
			</Box>
		);
	}

	// Si no hay datos del cliente o de las gráficas
	if (!client || !tiposPagoData) {
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					textAlign: 'center',
				}}
			>
				<Typography>No hay datos disponibles para mostrar estadísticas</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				p: 3,
				bgcolor: 'background.paper',
				borderBottomLeftRadius: 8,
				borderBottomRightRadius: 8,
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Typography variant='h6' gutterBottom>
				Estadísticas del Cliente
			</Typography>

			<Grid container spacing={3} sx={{ mt: 1 }}>
				{/* Tarjetas con métricas generales */}
				<Grid item xs={12} md={6} lg={3}>
					<Card>
						<CardContent>
							<Typography variant='subtitle2' color='text.secondary'>
								Total Pagos
							</Typography>
							<Typography variant='h4' sx={{ mt: 1 }}>
								{stats.totalPagos}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={3}>
					<Card>
						<CardContent>
							<Typography variant='subtitle2' color='text.secondary'>
								Monto Total (USD)
							</Typography>
							<Typography variant='h4' sx={{ mt: 1 }}>
								${stats.montoTotalUSD.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={3}>
					<Card>
						<CardContent>
							<Typography variant='subtitle2' color='text.secondary'>
								Pagos en USD
							</Typography>
							<Typography variant='h4' sx={{ mt: 1 }}>
								{stats.totalUSD}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={3}>
					<Card>
						<CardContent>
							<Typography variant='subtitle2' color='text.secondary'>
								Pagos en VES
							</Typography>
							<Typography variant='h4' sx={{ mt: 1 }}>
								{stats.totalVES}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Gráficos */}
			<Grid container spacing={3} sx={{ mt: 2 }}>
				{/* Gráfico de barras - Días de Pago */}
				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 3 }}>
						<Typography variant='subtitle1' gutterBottom>
							Días de Pago
						</Typography>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart
								data={barChartData}
								margin={{
									top: 20,
									right: 30,
									left: 0,
									bottom: 5,
								}}
							>
								<XAxis dataKey='dia' />
								<YAxis
									label={{
										value: 'Pagos',
										angle: -90,
										position: 'insideLeft',
									}}
								/>
								<Tooltip />
								<Bar dataKey='pagos' fill='#0088FE' name='Pagos' />
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				{/* Gráfico de pastel - Tipos de Pago */}
				<Grid item xs={12} md={5}>
					<Paper sx={{ p: 3 }}>
						<Typography variant='subtitle1' gutterBottom>
							Tipos de Pago
						</Typography>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={pieChartData}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={100}
									fill='#8884d8'
									dataKey='value'
									nameKey='name'
									label={({ name }) =>
										`${name}: ${stats.percentages[name]}%`
									}
								>
									{pieChartData.map((_, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ClientStats;
