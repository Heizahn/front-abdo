import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';

const PersonalInfo = ({ data }: { data: { nombre: string; identificacion: string } }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Personal
			</Typography>
			<InfoField label='Nombre' value={data.nombre} />
			<InfoField label='C.I' value={data.identificacion} />
		</Box>
	);
};

export default PersonalInfo;
