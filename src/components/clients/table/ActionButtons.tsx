import { useState } from 'react';
import { Box, IconButton, Tooltip, Menu } from '@mui/material';
import { PaidRounded as PaidIcon, MoreVertRounded as MoreIcon } from '@mui/icons-material';
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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box onClick={(e) => e.stopPropagation()}>
			<Tooltip title='Botones de acción'>
				<IconButton onClick={handleClick}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<SimpleModalWrapper
					triggerButtonText=''
					triggerButtonColor='primary'
					showCloseButton={false}
					triggerComponent={
						<Tooltip title='Cargar pago'>
							<IconButton color='primary'>
								<PaidIcon />
							</IconButton>
						</Tooltip>
					}
				>
					<Pay
						clientesId={client.id}
						clientName={client.nombre}
						onCancel={() => {}}
					/>
				</SimpleModalWrapper>

				<SendLastPay clientesId={client.id} />
				{client.estado !== 'Retirado' && (
					<SuspendedClient clientStatus={client.estado} clientId={client.id} />
				)}
				{client.estado !== 'Activo' && (
					<RetirarButton clientStatus={client.estado} clientId={client.id} />
				)}
			</Menu>
		</Box>
	);
};
