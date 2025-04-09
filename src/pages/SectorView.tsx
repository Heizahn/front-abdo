import React from 'react';
import { Box } from '@mui/material';
import SectorsTable from '../components/sectors/SectorTable';
import MainLayout from '../layouts/MainLayout';

const SectorsView: React.FC = () => {
	return (
		<MainLayout title='Sectores'>
			<Box sx={{ backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
				{/* Sectors Table */}
				<SectorsTable />
			</Box>
		</MainLayout>
	);
};

export default SectorsView;
