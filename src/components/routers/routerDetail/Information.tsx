import { Typography } from '@mui/material';
import InfoField from '../../clientDetail/common/InfoField';

export default function Information({ router }: { router: any }) {
	return (
		<>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Información
			</Typography>
			{router && (
				<>
					<InfoField label='Nombre' value={router.nombre || 'N/A'} />
					<InfoField label='IP' value={router.ip || 'N/A'} />
					<InfoField label='Sector' value={router.sectores.nombre || 'N/A'} />
					<InfoField label='Dirección' value={router.direccion || 'N/A'} />
					<InfoField label='Descripción' value={router.descripcion || 'N/A'} />
				</>
			)}
		</>
	);
}
