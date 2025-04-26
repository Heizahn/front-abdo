import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LayersIcon from '@mui/icons-material/Layers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouterIcon from '@mui/icons-material/Router';
import { ROLES } from '../context/AuthContext'; // Importa las constantes de roles

// Modificamos la estructura para incluir los roles permitidos para cada ítem
export const navigationItems = [
	{
		text: 'Home',
		icon: <HomeIcon />,
		path: '/home',
		allowedRoles: [ROLES.SUPERADMIN], // Solo superadmin puede ver el dashboard
	},
	{
		text: 'Clientes',
		icon: <PeopleIcon />,
		path: '/clients',
		allowedRoles: [ROLES.SUPERADMIN, ROLES.ACCOUNTANT, ROLES.PROVIDER], // Superadmin y admin pueden ver clientes
	},
	{
		text: 'Pagos',
		icon: <AttachMoneyIcon />,
		path: '/payments',
		allowedRoles: [ROLES.SUPERADMIN, ROLES.ACCOUNTANT, ROLES.PAYMENT_USER, ROLES.PROVIDER], // Todos pueden ver pagos
	},
	{
		text: 'Servicios',
		icon: <LayersIcon />,
		path: '/services',
		allowedRoles: [ROLES.SUPERADMIN], // Solo superadmin puede ver servicios
	},
	{
		text: 'Sectores',
		icon: <LocationOnIcon />,
		path: '/sectors',
		allowedRoles: [ROLES.SUPERADMIN], // Solo superadmin puede ver sectores
	},
	{
		text: 'Routers',
		icon: <RouterIcon />,
		path: '/routers',
		allowedRoles: [ROLES.SUPERADMIN], // Solo superadmin puede ver routers
	},
];

// Función de utilidad para filtrar items por rol
export const getNavigationItemsByRole = (userRole: 0 | 1 | 2 | 3) => {
	// Si el rol es undefined o null, no mostrar ningún ítem
	if (userRole === undefined || userRole === null) {
		return [];
	}

	// Filtrar los items que el rol del usuario puede ver
	return navigationItems.filter((item) =>
		(item.allowedRoles as (0 | 1 | 2 | 3)[]).includes(userRole),
	);
};
