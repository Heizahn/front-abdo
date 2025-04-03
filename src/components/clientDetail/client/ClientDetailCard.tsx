import { Grid, Box } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import ContactInfo from './ContactInfo';
import LocationInfo from './LocationInfo';
import ServicesInfo from './ServicesInfo';
import BalanceInfo from './BalanceInfo';
import StatusInfo from './StatusInfo';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';

const ClientDetailsCard = () => {
	const { client } = useClientDetailsContext();

	if (client)
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Grid container spacing={4}>
					<Grid item xs={12} md={4}>
						<PersonalInfo data={client} />
					</Grid>
					<Grid item xs={12} md={4}>
						<ContactInfo data={client} />
					</Grid>
					<Grid item xs={12} md={4}>
						<LocationInfo data={client} />
					</Grid>
					<Grid item xs={12} md={4}>
						<ServicesInfo data={client} />
					</Grid>
					<Grid item xs={12} md={4}>
						<BalanceInfo data={client} />
					</Grid>
					<Grid item xs={12} md={4}>
						<StatusInfo data={client} />
					</Grid>
				</Grid>
			</Box>
		);
};

export default ClientDetailsCard;
