import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { formatDate } from '../../../services/formaterDate';

interface StatusInfoProps {
	data: {
		saldo: number;
		estado: string;
		creadoPor: string;
		fechaCreacion: string;
		editadoPor?: string;
		fechaEdicion?: string;
		suspendidoPor?: string;
		fechaSuspension?: string;
	};
}

const StatusInfo = ({ data }: StatusInfoProps) => {
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
						: data.saldo < 0 && data.estado === 'Activo'
						? 'warning'
						: 'error'
				}
			/>
			<InfoField label='Creado Por' value={data.creadoPor?.toUpperCase()} />
			<InfoField label='Fecha de Creación' value={formatDate(data.fechaCreacion)} />
			{data.editadoPor && (
				<InfoField label='Editado Por' value={data.editadoPor?.toUpperCase()} />
			)}
			{data.fechaEdicion && (
				<InfoField label='Fecha de Edición' value={formatDate(data.fechaEdicion)} />
			)}
			{data.suspendidoPor && data.suspendidoPor.length > 0 && (
				<InfoField label='Suspendido Por' value={data.suspendidoPor?.toUpperCase()} />
			)}
			{data.fechaSuspension && (
				<InfoField
					label='Fecha de Suspensión'
					value={formatDate(data.fechaSuspension)}
				/>
			)}
		</Box>
	);
};

export default StatusInfo;
