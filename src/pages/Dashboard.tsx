import { Grid } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import CollectionsChart from '../components/dashboard/CollectionsChart';
import ClientStatusChart from '../components/dashboard/ClientStatusChart';
import RecentPaymentsTable from '../components/dashboard/RecentPaymentsTable';
import MonthlyCollection from '../components/dashboard/MonthlyCollection';

const Dashboard = () => {
	return (
		<MainLayout title='Home'>
			{/* Charts Row */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				{/* Bar Chart */}
				<Grid item xs={12} md={6}>
					<CollectionsChart />
				</Grid>

				{/* Bar Chart */}
				<Grid item xs={12} md={3}>
					<MonthlyCollection />
				</Grid>
				{/* Pie Chart */}
				<Grid item xs={12} md={3}>
					<ClientStatusChart />
				</Grid>
			</Grid>

			<RecentPaymentsTable />
		</MainLayout>
	);
};

export default Dashboard;
