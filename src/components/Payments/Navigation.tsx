import { Tabs, Tab, Box } from '@mui/material';

interface NavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
	const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
		onTabChange(newValue);
	};

	const tabs = [
		{ label: 'Crear Pago', value: 'create' },
		{ label: 'Últimos Pagos', value: 'payments' },
	];

	return (
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs
				value={activeTab}
				onChange={handleTabChange}
				aria-label='client navigation tabs'
				variant='scrollable'
				scrollButtons='auto'
			>
				{tabs.map((tab) => (
					<Tab
						key={tab.value}
						label={tab.label}
						value={tab.value}
						sx={{
							fontWeight: 'medium',
							'&.Mui-selected': {
								color: 'primary.main',
							},
						}}
					/>
				))}
			</Tabs>
		</Box>
	);
};

export default Navigation;
