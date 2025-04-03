import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';
import { Link } from '@mui/material';

interface ServicesInfoProps {
	data: ClientDetails | null;
}

const ServicesInfo: React.FC<ServicesInfoProps> = ({ data }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Servicios
			</Typography>
			<InfoField label='Router' value={data?.router?.nombre || 'N/A'} />
			<InfoField
				label='IPv4'
				value={
					(data && (
						<Link href={`http://${data.ipv4}`} target='_blank'>
							{data.ipv4}
						</Link>
					)) ||
					'N/A'
				}
			/>
			<InfoField label='Plan' value={data?.plan?.nombre || 'N/A'} />
		</Box>
	);
};

export default ServicesInfo;
