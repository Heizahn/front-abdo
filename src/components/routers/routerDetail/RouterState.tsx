import { Box, Typography } from '@mui/material';
import InfoField from '../../clientDetail/common/InfoField';

const StatusInfo = ({ data }: { data: any }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Estado
			</Typography>
			{data && (
				<>
					<InfoField
						label='Estado'
						value={data.estado}
						color={data.estado === 'Activo' ? 'success' : 'error'}
					/>
					<InfoField
						label='Creado Por'
						value={data.creadoPor.username.toUpperCase() || 'N/A'}
					/>
					<InfoField label='Fecha de Creación' value={data.fechaCreacion} />
					{data.editadoPor && (
						<InfoField
							label='Editado Por'
							value={data.editadoPor.username.toUpperCase() || 'N/A'}
						/>
					)}
					{data.fechaEdicion && (
						<InfoField label='Fecha de Edición' value={data.fechaEdicion} />
					)}
				</>
			)}
		</Box>
	);
};

export default StatusInfo;
