import { Tabs, Tab, Box } from '@mui/material';
import { useClientDetailsContext } from '../../context/ClientDetailContext';

interface NavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	tabs: { label: string; value: string }[];
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, tabs }) => {
	const { setIsEditing, error, isClientLoading } = useClientDetailsContext();

	const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
		onTabChange(newValue);
		setIsEditing(false);
	};

	if (error || isClientLoading) {
		return null;
	}

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
