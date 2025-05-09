import { Paper, Typography } from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useFetchData } from '../../hooks/useQuery';
import { CollectionsChartDTO } from '../../interfaces/Interfaces';
import CollectionsChartSkeleton from './skeletons/CollectionsCharSkeleton';

const CollectionsChart = () => {
	const { data, isLoading, error } = useFetchData<
		[
			{
				data: CollectionsChartDTO[];
			},
		]
	>('/dashboard/payments/chart', 'paysBarChart0');

	if (isLoading) {
		return <CollectionsChartSkeleton />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const collections: CollectionsChartDTO[] =
		(data?.[0]?.data as CollectionsChartDTO[]) ?? [];

	return (
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{'Últimas Recaudaciones Diarias'}
			</Typography>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart
					data={collections}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='dim0' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey='mea0' name='USD' fill='#1976d2' />
					<Bar dataKey='mea1' name='VES' fill='#ed6c02' />
				</BarChart>
			</ResponsiveContainer>
		</Paper>
	);
};

export default CollectionsChart;
