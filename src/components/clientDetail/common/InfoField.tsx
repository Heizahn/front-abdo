import { Typography, Grid } from '@mui/material';
import { ReactNode } from 'react';

const InfoField = ({
	label,
	value,
	color,
}: {
	label: string;
	value: string | ReactNode;
	color?: string;
}) => (
	<Grid container spacing={1} sx={{ mb: 1 }}>
		<Grid item xs={5} md={4} sx={{ textAlign: 'right' }}>
			<Typography variant='body2' color='textSecondary'>
				{label}:
			</Typography>
		</Grid>
		<Grid item xs={7} md={8}>
			<Typography
				variant='body2'
				fontWeight='medium'
				color={color ? color : 'textPrimary'}
			>
				{value}
			</Typography>
		</Grid>
	</Grid>
);

export default InfoField;
