import React, { forwardRef } from 'react';
import {
	Snackbar,
	Alert as MuiAlert,
	AlertProps,
	Typography,
	Box,
	IconButton,
	Slide,
	SlideProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { NotificationAlertProps } from '../../interfaces/types';

// Componente Alert personalizado
const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

// Tipo para SlideTransition
type TransitionProps = Omit<SlideProps, 'direction'>;

// Función para el efecto de transición
const SlideTransition = (props: TransitionProps) => {
	return <Slide {...props} direction='down' />;
};

// Íconos según el tipo de alerta
const alertIcons = {
	success: <CheckCircleIcon />,
	error: <ErrorIcon />,
	warning: <WarningIcon />,
	info: <InfoIcon />,
};

const NotificationAlert: React.FC<NotificationAlertProps> = ({
	open,
	onClose,
	title,
	message,
	severity = 'info',
	autoHideDuration = 4000,
	position = { vertical: 'top', horizontal: 'right' },
}) => {
	const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		onClose();
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			anchorOrigin={position}
			TransitionComponent={SlideTransition}
		>
			<Alert
				severity={severity}
				sx={{
					width: '100%',
					minWidth: '300px',
					boxShadow: 3,
					'& .MuiAlert-icon': {
						display: 'flex',
						alignItems: 'center',
						fontSize: '2rem',
						marginRight: 1,
					},
				}}
				icon={alertIcons[severity]}
				action={
					<IconButton
						size='small'
						aria-label='close'
						color='inherit'
						onClick={handleClose}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				}
			>
				<Box>
					{title && (
						<Typography variant='subtitle1' fontWeight='bold'>
							{title}
						</Typography>
					)}
					<Typography variant='body2'>{message}</Typography>
				</Box>
			</Alert>
		</Snackbar>
	);
};

export default NotificationAlert;
