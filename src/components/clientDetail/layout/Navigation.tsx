import { Tabs, Tab, Box } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';

interface NavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
	const { setIsEditing } = useClientDetailsContext();

	const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
		onTabChange(newValue);
		setIsEditing(false);
	};

	const tabs = [
		{ label: 'Detalles del Cliente', value: 'details' },
		{ label: 'Cuentas por Cobrar', value: 'accounts' },
		{ label: 'Pagos', value: 'payments' },
		{ label: 'Estadísticas', value: 'stats' },
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
