import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LayersIcon from '@mui/icons-material/Layers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouterIcon from '@mui/icons-material/Router';

export const navigationItems = [
	{ text: 'Home', icon: <HomeIcon />, path: '/home' },
	{ text: 'Clientes', icon: <PeopleIcon />, path: '/clients' },
	{ text: 'Pagos', icon: <AttachMoneyIcon />, path: '/pagos' },
	{ text: 'Servicios', icon: <LayersIcon />, path: '/servicios' },
	{ text: 'Sectores', icon: <LocationOnIcon />, path: '/sectores' },
	{ text: 'Routers', icon: <RouterIcon />, path: '/routers' },
];
