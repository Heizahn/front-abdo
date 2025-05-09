import { Box, Typography, Paper } from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList,
} from 'recharts';
import { useFetchData } from '../../hooks/useQuery';
import MonthlyCollectionSkeleton from './skeletons/MonthlyCollectionSkeleton';

export default function MonthlyCollection() {
	const { data, isLoading, error } = useFetchData<
		[{ _id: string; mea0: number; mea1: number }]
	>('/dashboard/payments/monthly/collection', 'monthlyCollection');

	if (isLoading) {
		return <MonthlyCollectionSkeleton />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!data || Boolean(!data.length)) {
		return <div>No hay datos disponibles</div>;
	}

	// Formatear los datos para el gráfico
	const chartData = data.map((item) => ({
		periodo: item._id,
		recaudado: item.mea1,
		porCobrar: item.mea0,
	}));

	// Función para formatear valores en el eje Y
	const formatYAxis = (value: number) => {
		if (value === 0) return '0';
		if (value >= 1000) return `${Math.round(value / 1000)} mil`;
		return value.toString();
	};

	const formatBarLabel = (value: number) => {
		if (value >= 1000) return `${Math.round(value / 1000)}k`;
		return value.toString();
	};

	return (
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='h6' component='h2' gutterBottom>
				Recaudación del Mes
			</Typography>
			<Box sx={{ width: '100%', height: 300 }}>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart
						data={chartData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='periodo' />
						<YAxis tickFormatter={formatYAxis} domain={[0, 'dataMax + 200']} />
						<Tooltip labelFormatter={(value) => `Periodo: ${value}`} />
						<Legend />
						<Bar dataKey='recaudado' name='Recaudado' fill='#1976d2'>
							<LabelList
								dataKey='recaudado'
								position='top'
								formatter={formatBarLabel}
							/>
						</Bar>
						<Bar dataKey='porCobrar' name='Por Cobrar' fill='#ed6c02'>
							<LabelList
								dataKey='porCobrar'
								position='top'
								formatter={formatBarLabel}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Paper>
	);
}
