import { Box } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import PlansTable from '../components/Services/TablaServices';

export default function ServicesView() {
	return (
		<MainLayout title='Servicios'>
			<Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
				<PlansTable />
			</Box>
		</MainLayout>
	);
}
