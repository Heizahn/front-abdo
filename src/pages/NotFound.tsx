import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				height: 'calc(100vh - 88px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: { xs: 3, sm: 6 },
					textAlign: 'center',
					maxWidth: '600px',
					borderRadius: 2,
				}}
			>
				<ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

				<Typography
					variant='h1'
					component='h1'
					sx={{
						fontSize: { xs: '5rem', sm: '8rem' },
						fontWeight: 700,
						color: 'grey.800',
						lineHeight: 1,
						mb: 2,
					}}
				>
					404
				</Typography>

				<Typography
					variant='h4'
					gutterBottom
					sx={{
						fontWeight: 500,
						color: 'grey.700',
						mb: 2,
					}}
				>
					Página no encontrada
				</Typography>

				<Typography
					variant='body1'
					sx={{
						mb: 4,
						maxWidth: '80%',
						mx: 'auto',
						color: 'grey.600',
					}}
				>
					Lo sentimos, la página que estás buscando no existe o ha sido movida.
					Verifica la URL o regresa a la página principal.
				</Typography>

				<Button
					variant='contained'
					color='primary'
					size='large'
					startIcon={<HomeIcon />}
					onClick={() => navigate('/')}
					sx={{
						borderRadius: 2,
						px: 4,
						py: 1,
					}}
				>
					Volver al inicio
				</Button>

				<Button
					variant='outlined'
					color='primary'
					size='large'
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
					sx={{
						borderRadius: 2,
						px: 4,
						py: 1,
						mx: 2,
					}}
				>
					Volver atrás
				</Button>
			</Paper>
		</Box>
	);
}
