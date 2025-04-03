import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

const BalanceInfo = ({ data }: { data: ClientDetails }) => {
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
			<InfoField label='Día de Pago' value={data.fechaPago} />
		</Box>
	);
};

export default BalanceInfo;
