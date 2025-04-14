import { Box, Skeleton, Paper, Typography } from '@mui/material';

export default function CollectionsChartSkeleton() {
	return (
		<Paper
			elevation={1}
			sx={{
				p: 2,
				borderRadius: 2,
				height: '100%',
				bgcolor: '#ffffff',
			}}
		>
			<Typography variant='h6' component='h2' gutterBottom>
				Últimas Recaudaciones Diarias
			</Typography>

			<Box
				sx={{
					width: '100%',
					height: 300,
					position: 'relative',
					padding: 2,
				}}
			>
				{/* Fondo del gráfico */}
				<Skeleton
					variant='rectangular'
					width='100%'
					height='100%'
					sx={{ opacity: 0.3, borderRadius: 1 }}
				/>

				{/* Barras simuladas */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 50,
						left: 65,
						right: 40,
						top: 30,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
					}}
				>
					{/* 8 barras con diferentes alturas */}
					<Skeleton variant='rectangular' width='4%' height='20%' />
					<Skeleton variant='rectangular' width='4%' height='30%' />
					<Skeleton variant='rectangular' width='4%' height='45%' />
					<Skeleton variant='rectangular' width='4%' height='90%' />
					<Skeleton variant='rectangular' width='4%' height='35%' />
					<Skeleton variant='rectangular' width='4%' height='40%' />
					<Skeleton variant='rectangular' width='4%' height='65%' />
					<Skeleton variant='rectangular' width='4%' height='45%' />
					<Skeleton variant='rectangular' width='4%' height='10%' />
				</Box>

				{/* Skeleton para los valores del eje Y */}
				<Box
					sx={{
						position: 'absolute',
						left: 20,
						top: 15,
						bottom: 50,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<Skeleton variant='text' width={40} />
					<Skeleton variant='text' width={40} />
					<Skeleton variant='text' width={40} />
					<Skeleton variant='text' width={40} />
				</Box>

				{/* Skeleton para los valores del eje X */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 20,
						left: 65,
						right: 40,
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
					<Skeleton variant='text' width={30} />
				</Box>
			</Box>
		</Paper>
	);
}
