import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

const ContactInfo = ({ data }: { data: ClientDetails }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Contacto
			</Typography>
			<InfoField label='Teléfono' value={data.telefonos} />
			<InfoField label='Email' value={data.email} />
		</Box>
	);
};

export default ContactInfo;
