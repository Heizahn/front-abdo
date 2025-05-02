import { Box, IconButton, Tooltip } from '@mui/material';
import { PaidRounded as PaidIcon } from '@mui/icons-material';
import SimpleModalWrapper from '../../common/ContainerForm';
import Pay from '../../common/Pay';
import SendLastPay from '../SendLastPay';
import SuspendedClient from '../../common/SuspendedClient';
import { Client } from '../../../interfaces/Interfaces';
import RetirarButton from '../../common/RetirarButton';

interface ActionButtonsProps {
	client: Client;
}

export const ActionButtons = ({ client }: ActionButtonsProps) => {
	return (
		<Box onClick={(e) => e.stopPropagation()} sx={{ padding: 0 }}>
			<SimpleModalWrapper
				triggerButtonText=''
				triggerButtonColor='primary'
				showCloseButton={false}
				triggerComponent={
					<Tooltip title='Cargar pago'>
						<IconButton color='primary' sx={{ padding: 0 }}>
							<PaidIcon />
						</IconButton>
					</Tooltip>
				}
				triggerButtonSx={{
					padding: 0,
				}}
			>
				<Pay clientesId={client.id} clientName={client.sName} onCancel={() => {}} />
			</SimpleModalWrapper>

			<SendLastPay clientesId={client.id} />
			{client.sState !== 'Retirado' && (
				<SuspendedClient clientStatus={client.sState} clientId={client.id} />
			)}
			{client.sState !== 'Activo' && (
				<RetirarButton clientStatus={client.sState} clientId={client.id} />
			)}
		</Box>
	);
};
