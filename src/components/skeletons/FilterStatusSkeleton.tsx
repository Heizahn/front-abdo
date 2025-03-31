import { Box, Skeleton } from '@mui/material';

export default function FilterStatusSkeleton() {
	return (
		<Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1, mb: 1 }}>
			<Skeleton
				variant='rectangular'
				width={120}
				height={36}
				sx={{
					borderRadius: '18px',
					bgcolor: 'rgba(0, 0, 0, 0.08)',
				}}
			/>
		</Box>
	);
}
