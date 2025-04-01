import React from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from '@mui/material';
import { ConfirmDialogProps } from '../../interfaces/types';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	onClose,
	onConfirm,
	title = 'Confirmar acción',
	message = '¿Está seguro que desea continuar con esta acción?',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	confirmColor = 'primary',
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='inherit'>
					{cancelText}
				</Button>
				<Button onClick={onConfirm} color={confirmColor} variant='contained' autoFocus>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
