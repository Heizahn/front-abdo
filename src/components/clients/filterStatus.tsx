import { Paper, Typography } from '@mui/material';
import React from 'react';
type FilterStatusButtonProps = {
	title: string;
	clientStats: number;
	color: string;
	active: boolean;
	setClientStatsFiltered: React.Dispatch<
		React.SetStateAction<{
			todos: boolean;
			solventes: boolean;
			morosos: boolean;
			suspendidos: boolean;
			retirados: boolean;
		}>
	>;
};
const FilterStatusButton = ({
	title,
	clientStats,
	color,
	active,
	setClientStatsFiltered,
}: FilterStatusButtonProps) => {
	return (
		<Paper
			onClick={() => {
				setClientStatsFiltered((prev) => ({
					...prev,
					todos: false,
					solventes: false,
					morosos: false,
					suspendidos: false,
					retirados: false,
					[title.toLowerCase()]: true,
				}));
			}}
			elevation={0}
			sx={{
				width: 100,
				textAlign: 'center',
				borderBottom: `3px solid ${active ? color : 'transparent'}`,
				cursor: 'pointer',
				transition: 'all 0.2s',
				'&:hover': {
					boxShadow: 1,
				},

				boxShadow: `${active ? 1 : 0}`,
			}}
		>
			<Typography variant='h6'>{clientStats}</Typography>
			<Typography variant='body2' color='text.secondary'>
				{title}
			</Typography>
		</Paper>
	);
};

export default FilterStatusButton;
