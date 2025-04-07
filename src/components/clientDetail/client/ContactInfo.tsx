import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import EditableInfoField from '../common/EditableInfoField';

const ContactInfo = ({ data }: { data: ClientDetails }) => {
	const { isEditing } = useClientDetailsContext();
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Contacto
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Teléfono' value={data.telefonos} />
					<InfoField label='Email' value={data.email} />
				</>
			) : (
				<>
					<EditableInfoField
						label='Teléfono'
						valueInitial={data.telefonos}
						name='telefonos'
					/>
					<EditableInfoField label='Email' valueInitial={data.email} name='email' />
				</>
			)}
		</Box>
	);
};

export default ContactInfo;
