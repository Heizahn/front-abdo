import {
	Box,
	Drawer,
	AppBar,
	Toolbar,
	Typography,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
} from '@mui/material';

// Importar los items de navegación y la función para filtrarlos por rol
import { getNavigationItemsByRole } from '../constants/navigationItems';
import { useNavigate, useLocation } from 'react-router-dom'; // Añadimos useLocation
import PerfilButton from '../components/perfil-botton';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de autenticación

const drawerWidth = 220;

const MainLayout = ({
	children,
	title = 'Home',
}: {
	children: React.ReactNode;
	title: string;
}) => {
	const navigate = useNavigate();
	const location = useLocation(); // Obtenemos la ubicación actual
	const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticación

	// Filtramos los items de navegación según el rol del usuario
	const filteredNavigationItems = getNavigationItemsByRole(user?.nRole as 0 | 1 | 2);

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	const drawer = (
		<div>
			<Toolbar>
				<img src={logo} alt='logo' width='100%' />
			</Toolbar>
			<Divider />
			<List>
				{filteredNavigationItems.map((item) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton
							onClick={() => handleNavigation(item.path)}
							selected={location.pathname === item.path}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<Box
			sx={{
				display: 'flex',
				minHeight: '100vh',
				bgcolor: '#f5f5f5',
			}}
		>
			<AppBar
				position='fixed'
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
					bgcolor: 'white',
					color: 'text.primary',
					boxShadow: 1,
				}}
			>
				<Toolbar>
					<Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
						{title}
					</Typography>
					<PerfilButton />
				</Toolbar>
			</AppBar>
			<Box
				component='nav'
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label='mailbox folders'
			>
				<Drawer
					variant='permanent'
					sx={{
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					bgcolor: '#f5f5f5',
				}}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default MainLayout;
