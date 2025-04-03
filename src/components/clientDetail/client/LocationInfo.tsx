import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

const LocationInfo = ({ data }: { data: ClientDetails }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Ubicación
			</Typography>
			<InfoField label='Sector' value={data.sector?.nombre || 'No asignado'} />
			<InfoField label='Dirección' value={data.direccion} />
		</Box>
	);
};

export default LocationInfo;
