import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Fab, Tooltip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { SimpleModalWrapperProps } from '../../interfaces/types';

// Propiedades para el contenedor simple

/**
 * Contenedor simple para mostrar cualquier contenido en un modal.
 * No maneja ninguna lógica más allá de mostrar/ocultar.
 */
function SimpleModalWrapper({
	children,
	triggerComponent,
	triggerButtonText = 'Abrir',
	triggerButtonType = 'button',
	triggerTooltip = 'Abrir',
	triggerButtonSx = {},
	triggerButtonColor = 'primary',
	maxWidth = 'sm',
	fullScreen = false,
	showCloseButton = true,
	size = 'medium',
	icon,
}: SimpleModalWrapperProps) {
	const [open, setOpen] = useState<boolean>(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Renderizar el botón de activación según el tipo
	const renderTrigger = () => {
		if (triggerComponent) {
			return (
				<Box onClick={handleOpen} sx={{ cursor: 'pointer', display: 'inline-block' }}>
					{triggerComponent}
				</Box>
			);
		}

		if (triggerButtonType === 'fab') {
			return (
				<Tooltip title={triggerTooltip}>
					<Fab
						color={triggerButtonColor}
						aria-label={triggerTooltip}
						onClick={handleOpen}
						sx={triggerButtonSx}
						size={size}
					>
						<AddIcon />
					</Fab>
				</Tooltip>
			);
		}

		return (
			<Button
				variant='contained'
				color={triggerButtonColor}
				onClick={handleOpen}
				sx={triggerButtonSx}
				size={size}
				startIcon={icon}
			>
				{triggerButtonText}
			</Button>
		);
	};

	return (
		<>
			{renderTrigger()}

			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth={maxWidth}
				fullWidth
				fullScreen={fullScreen}
				PaperProps={{
					sx: {
						overflowY: 'visible',
						'& .MuiDialogContent-root': {
							padding: 2,
						},
					},
				}}
			>
				{showCloseButton && (
					<IconButton
						aria-label='close'
						onClick={handleClose}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
							zIndex: 1,
						}}
						size={size}
					>
						<CloseIcon />
					</IconButton>
				)}

				<DialogContent>
					{/* Renderizar el contenido y pasar varias propiedades con diferentes nombres para mayor compatibilidad */}
					{React.isValidElement(children)
						? React.cloneElement(
								children as React.ReactElement<{
									onClose?: () => void;
									closeModal?: () => void;
									onCancel?: () => void;
								}>,
								{
									onClose: handleClose,
									closeModal: handleClose,
									onCancel: () => handleClose(), // Sobrescribe la función onCancel para que cierre el modal
								},
						  )
						: children}
				</DialogContent>
			</Dialog>
		</>
	);
}

export default SimpleModalWrapper;
