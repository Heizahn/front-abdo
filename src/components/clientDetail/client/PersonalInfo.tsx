import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import EditableInfoField from '../common/EditableInfoField';

const PersonalInfo = ({ data }: { data: { nombre: string; identificacion: string } }) => {
	const { isEditing } = useClientDetailsContext();
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Personal
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Nombre' value={data.nombre} />
					<InfoField label='C.I' value={data.identificacion} />
				</>
			) : (
				<>
					<EditableInfoField
						label='Nombre'
						valueInitial={data.nombre}
						name='nombre'
					/>
					<EditableInfoField
						label='C.I'
						valueInitial={data.identificacion}
						name='identificacion'
					/>
				</>
			)}
		</Box>
	);
};

export default PersonalInfo;
