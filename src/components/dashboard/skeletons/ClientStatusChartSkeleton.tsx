import { Box, Typography, Skeleton, Paper } from '@mui/material';

const ClientsStatusChartSkeleton = () => {
	return (
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{'Estado de Clientes'}
			</Typography>

			{/* Círculo skeleton */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mb: 3,
				}}
			>
				<Skeleton variant='circular' width={200} height={200} animation='pulse' />
			</Box>

			{/* Leyenda skeleton */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					gap: 4,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Skeleton variant='circular' width={16} height={16} sx={{ mr: 1 }} />
					<Skeleton width={80} />
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Skeleton variant='circular' width={16} height={16} sx={{ mr: 1 }} />
					<Skeleton width={80} />
				</Box>
			</Box>
		</Paper>
	);
};

export default ClientsStatusChartSkeleton;
