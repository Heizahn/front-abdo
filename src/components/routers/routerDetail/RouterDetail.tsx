import { Box, Grid } from '@mui/material';
import Information from './Information';
import StatusInfo from './RouterState';

export default function RouterDetail({ router }: { router: any }) {
	return (
		<Box
			sx={{
				p: 3,
				bgcolor: 'background.paper',
				borderBottomLeftRadius: 8,
				borderBottomRightRadius: 8,
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Grid container spacing={6} sx={{ px: 4 }}>
				<Grid item xs={12} md={6}>
					<Information router={router} />
				</Grid>
				<Grid item xs={12} md={6}>
					<StatusInfo data={router} />
				</Grid>
			</Grid>
		</Box>
	);
}
