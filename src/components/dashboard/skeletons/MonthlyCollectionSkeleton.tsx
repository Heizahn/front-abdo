import { Box, Skeleton, Paper, Typography } from '@mui/material';

export default function MonthlyCollectionSkeleton() {
	return (
		<Paper elevation={1} sx={{ p: 2, height: '100%', bgcolor: '#ffffff' }}>
			<Typography variant='h6' component='h2' gutterBottom>
				Recaudación del Mes
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

				{/* Contenedor para las barras simuladas */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 50,
						left: 0,
						right: 0,
						top: 30,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'flex-end',
					}}
				>
					{/* Grupo de barras del mes */}
					<Box
						sx={{
							width: '60%',
							display: 'flex',
							justifyContent: 'center',
							gap: 3,
							alignItems: 'flex-end',
							ml: 3,
						}}
					>
						{/* Barra Recaudado */}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Skeleton variant='text' width={35} height={25} />
							<Skeleton variant='rectangular' width={100} height={80} />
						</Box>

						{/* Barra Por Cobrar */}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Skeleton variant='text' width={35} height={25} />
							<Skeleton variant='rectangular' width={100} height={180} />
						</Box>
					</Box>
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
						left: 25,
						right: 0,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Skeleton variant='text' width={80} height={30} />
				</Box>

				{/* Skeleton para la leyenda */}
				<Box
					sx={{
						position: 'absolute',
						bottom: -10,
						left: 25,
						right: 0,
						display: 'flex',
						gap: 1,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Skeleton variant='text' width={120} height={30} />
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Skeleton variant='text' width={120} height={30} />
					</Box>
				</Box>
			</Box>
		</Paper>
	);
}
