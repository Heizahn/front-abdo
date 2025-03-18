import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../data/mockData';

const ClientStatusChart = ({ data, title = 'Estado de Clientes', height = 300 }) => {
	return (
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{title}
			</Typography>
			<ResponsiveContainer width='100%' height={height}>
				<PieChart>
					<Pie
						data={data}
						cx='50%'
						cy='50%'
						labelLine={true}
						outerRadius={100}
						fill='#8884d8'
						dataKey='value'
						label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
					>
						{data.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={CHART_COLORS[index % CHART_COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip formatter={(value) => `${value}%`} />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</Paper>
	);
};

export default ClientStatusChart;
