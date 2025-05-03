import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import EditableInfoField from '../common/EditableInfoField';

const PersonalInfo = ({ data }: { data: { nombre: string; dni: string; rif: string } }) => {
	const { isEditing } = useClientDetailsContext();
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Personal
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Nombre' value={data.nombre} />
					<InfoField
						label={data.dni ? 'C.I.' : 'RIF'}
						value={data.dni || data.rif}
					/>
				</>
			) : (
				<>
					<EditableInfoField
						label='Nombre'
						valueInitial={data.nombre}
						name='sName'
					/>
					<EditableInfoField
						label={data.dni ? 'C.I.' : 'RIF'}
						valueInitial={data.dni || data.rif}
						name={data.dni ? 'sDni' : 'sRif'}
					/>
				</>
			)}
		</Box>
	);
};

export default PersonalInfo;
