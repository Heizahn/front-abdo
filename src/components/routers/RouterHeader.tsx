import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { RouterRounded as RouterIcon } from '@mui/icons-material';
import StatusBadge from '../clientDetail/common/StatusBadge';
import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { queryClient } from '../../query-client';
import { HOST_API } from '../../config/env';
import ConfirmDialog from '../common/Confirm';
export default function RouterHeader({
	activeTab,
	router,
}: {
	activeTab: string;
	router: any;
}) {
	const [suspending, setSuspending] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const { notifySuccess, notifyError } = useNotification();

	const queryKeys = ['routersList', 'router-' + router?.id];
	const handleSuspend = async () => {
		setSuspending(true);

		try {
			await axios.patch(HOST_API + '/routers/' + router.id, {
				estado: router.estado === 'Activo' ? 'Desactivo' : 'Activo',
			});

			notifySuccess(
				`El router se ha ${
					router.estado === 'Activo' ? 'Desactivado' : 'Activado'
				} correctamente`,
				router.estado === 'Activo' ? 'Desactivo' : 'Activado',
			);

			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al suspender el router');
			}
		} finally {
			setSuspending(false);
		}
	};

	const handleConfirm = () => {
		handleSuspend();
		setShowConfirmation(false);
	};
	return (
		<Box
			sx={{
				p: 2,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Stack direction='row' spacing={2} alignItems='center'>
				<Avatar sx={{ bgcolor: 'primary.main' }}>
					<RouterIcon />
				</Avatar>
				<Box>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Typography variant='h5' component='h1'>
							{router && router.nombre}
						</Typography>
						<StatusBadge status={router && router.estado} />
					</Stack>
					<Typography
						variant='body2'
						sx={{
							fontSize: '0.8rem',
							textAlign: 'start',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						Clientes: {router && router.clientes.length}
					</Typography>
				</Box>
			</Stack>
			<Stack direction='row' spacing={1}>
				{activeTab === 'details' && (
					<>
						<Button
							variant='outlined'
							color={router && router.estado === 'Activo' ? 'error' : 'primary'}
							onClick={() => setShowConfirmation(true)}
							disabled={suspending}
						>
							{router && router.estado === 'Activo' ? 'Desactivar' : 'Reactivar'}
						</Button>
						<Button
							variant={'contained'}
							color='primary'
							onClick={() => console.log('hola')}
						>
							{'Editar'}
						</Button>
					</>
				)}
			</Stack>

			<ConfirmDialog
				open={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				onConfirm={handleConfirm}
				title='Confirmar actualización'
				message={`¿Está seguro que desea ${
					router && router.estado === 'Activo' ? 'desactivar' : 'reactivar'
				} este equipo?`}
				confirmText={`${
					router && router.estado === 'Activo' ? 'Desactivar' : 'Reactivar'
				}`}
				cancelText='Cancelar'
			/>
		</Box>
	);
}
