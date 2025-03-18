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

const CollectionsChart = ({ data, title = 'Últimas Recaudaciones Diarias', height = 300 }) => {
	return (
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{title}
			</Typography>
			<ResponsiveContainer width='100%' height={height}>
				<BarChart
					data={data}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='date' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey='usd' name='USD' fill='#1976d2' />
					<Bar dataKey='ves' name='VES' fill='#ed6c02' />
				</BarChart>
			</ResponsiveContainer>
		</Paper>
	);
};

export default CollectionsChart;
