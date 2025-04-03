import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

const StatusInfo = ({ data }: { data: ClientDetails }) => {
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Estado
			</Typography>
			<InfoField
				label='Estado'
				value={data.estado}
				color={
					data.estado === 'Activo' && data.saldo >= 0
						? 'success'
						: data.saldo < 0
						? 'warning'
						: 'error'
				}
			/>
			<InfoField label='Creado Por' value={data.creadoPor} />
			<InfoField label='Fecha de Creación' value={data.fechaCreacion} />
			{data.editadoPor && <InfoField label='Editado Por' value={data.editadoPor} />}
			{data.fechaEdicion && (
				<InfoField label='Fecha de Edición' value={data.fechaEdicion} />
			)}
		</Box>
	);
};

export default StatusInfo;
