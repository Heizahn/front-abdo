import { AccountCircle, Logout } from '@mui/icons-material';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PerfilButton() {
	const [open, setOpen] = useState(false);
	const { logout, user } = useAuth();

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleLogout = () => {
		logout();
		handleClose();
	};

	return (
		<>
			<Button
				aria-label='Perfil'
				aria-controls='menu-appbar'
				aria-haspopup='true'
				onClick={handleMenu}
				color='inherit'
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.7,
				}}
			>
				<AccountCircle />
				<Typography>{user?.sName}</Typography>
			</Button>
			<Menu
				id='menu-appbar'
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={open}
				onClose={handleClose}
			>
				<MenuItem disabled>
					<ListItemIcon>
						<AccountCircle />
					</ListItemIcon>
					<ListItemText primary={user?.sName} />
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					<ListItemText primary='Cerrar sesión' />
				</MenuItem>
			</Menu>
		</>
	);
}
