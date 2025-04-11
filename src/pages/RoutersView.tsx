import { Box } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import RouterTable from '../components/routers/RouterTable';

export default function RoutersView() {
	return (
		<MainLayout title='Routers y OLTs'>
			<Box sx={{ bgcolor: 'background.paper', pt: 2, borderRadius: 2 }}>
				<RouterTable />
			</Box>
		</MainLayout>
	);
}
