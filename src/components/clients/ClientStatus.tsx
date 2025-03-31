import { Box, Typography } from '@mui/material';

const getStateComponent = (estado: string) => {
	switch (estado) {
		case 'Activo':
			return (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='body1' color='green'>
						Activo
					</Typography>
				</Box>
			);
		case 'Moroso':
			return (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='body1' color='warning.main'>
						Activo
					</Typography>
				</Box>
			);
		case 'Suspendido':
			return (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='body1' color='error'>
						Suspendido
					</Typography>
				</Box>
			);
		case 'Retirado':
			return (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='body1' color='text.disabled'>
						Retirado
					</Typography>
				</Box>
			);
		default:
			return (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='body2' color='text.disabled'>
						{estado}
					</Typography>
				</Box>
			);
	}
};

export { getStateComponent };
