import React from 'react';
import { Box, Skeleton, Grid, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const EquipoSkeleton: React.FC = () => {
	return (
		<Box
			sx={{
				width: '100%',
				py: 3,
				px: 4,
				backgroundColor: 'background.paper',
				borderRadius: 2,
			}}
		>
			{/* Breadcrumbs */}
			<Box sx={{ display: 'flex', mb: 2 }}>
				<Skeleton variant='text' width={80} height={24} />
				<NavigateNextIcon color='disabled' />
				<Skeleton variant='text' width={60} height={24} />
			</Box>

			{/* Team Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
				<Skeleton
					variant='circular'
					width={60}
					height={60}
					sx={{ bgcolor: 'grey.200', mr: 2 }}
				/>
				<Box sx={{ flexGrow: 1 }}>
					<Skeleton variant='text' width={150} height={36} />
					<Skeleton variant='text' width={100} height={24} />
				</Box>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Skeleton variant='rectangular' width={120} height={40} />
					<Skeleton variant='rectangular' width={100} height={40} />
				</Box>
			</Box>

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Skeleton variant='rectangular' width={200} height={48} />
			</Box>

			{/* Content Grid */}
			<Grid container spacing={4}>
				{/* Left column - Information */}
				<Grid item xs={12} md={6}>
					<Typography variant='h6' sx={{ px: 4 }}>
						<Skeleton variant='text' width={120} />
					</Typography>
					<Box sx={{ mt: 2, ml: 8 }}>
						{/* Information fields */}
						{[...Array(4)].map((_, index) => (
							<Box key={index} sx={{ display: 'flex', mb: 2 }}>
								<Skeleton
									variant='text'
									width={100}
									height={16}
									sx={{ mr: 2, mb: 1 }}
								/>
								<Skeleton variant='text' width={200} height={24} />
							</Box>
						))}
					</Box>
				</Grid>

				{/* Right column - Status */}
				<Grid item xs={12} md={6}>
					<Typography variant='h6'>
						<Skeleton variant='text' width={80} sx={{ px: 4 }} />
					</Typography>
					<Box sx={{ mt: 2, ml: 8 }}>
						{/* Status fields */}
						{[...Array(4)].map((_, index) => (
							<Box key={index} sx={{ display: 'flex', mb: 2 }}>
								<Skeleton
									variant='text'
									width={120}
									height={24}
									sx={{ mr: 2 }}
								/>
								<Skeleton variant='text' width={180} height={24} />
							</Box>
						))}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default EquipoSkeleton;
