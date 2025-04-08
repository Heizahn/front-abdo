import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Box } from '@mui/material';
import Navigation from '../components/Payments/Navigation';
import Create from '../components/Payments/Create';

export default function PaymentsView() {
	const [activeTab, setActiveTab] = useState('create');

	const renderTabContent = () => {
		switch (activeTab) {
			case 'create':
				return <Create />;
			case 'payments':
				return <>Payments</>;
			default:
				return <Create />;
		}
	};
	return (
		<MainLayout title='Pagos'>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 1,
					px: 6,
					pb: 2,
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Navigation activeTab={activeTab} onTabChange={setActiveTab} />
				{renderTabContent()}
			</Box>
		</MainLayout>
	);
}
