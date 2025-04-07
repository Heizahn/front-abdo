import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import { Edit } from '@mui/icons-material';
import EditableInfoField from '../common/EditableInfoField';

const BalanceInfo = ({ data }: { data: ClientDetails }) => {
	const { isEditing } = useClientDetailsContext();
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Balance
			</Typography>
			<InfoField
				label='Saldo'
				value={`${data.saldo}$`}
				color={data.saldo < 0 ? 'error' : 'success'}
			/>
			{!isEditing ? (
				<InfoField label='Día de Pago' value={data.fechaPago} />
			) : (
				<EditableInfoField
					label='Día de Pago'
					valueInitial={data.fechaPago}
					name='fechaPago'
					type='number'
				/>
			)}
		</Box>
	);
};

export default BalanceInfo;
