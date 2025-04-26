import { Grid, Box, Skeleton } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import ContactInfo from './ContactInfo';
import LocationInfo from './LocationInfo';
import ServicesInfo from './ServicesInfo';
import BalanceInfo from './BalanceInfo';
import StatusInfo from './StatusInfo';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';

const ClientDetailsCard = () => {
	const { client: data, isClientLoading, error } = useClientDetailsContext();

	if (isClientLoading) {
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Skeleton
					variant='rectangular'
					width='100%'
					height={200}
					sx={{ borderRadius: 3 }}
				/>
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				sx={{
					p: 3,
					bgcolor: 'background.paper',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
				}}
			></Box>
		);
	}

	return (
		<Box
			sx={{
				p: 3,
				bgcolor: 'background.paper',
				borderBottomLeftRadius: 8,
				borderBottomRightRadius: 8,
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Grid container spacing={4}>
				<Grid item xs={12} md={4}>
					<PersonalInfo
						data={{
							nombre: data?.nombre ?? '',
							identificacion: data?.identificacion ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<ContactInfo
						data={{
							telefonos: data?.telefonos ?? '',
							email: data?.email ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<LocationInfo
						data={{
							sector: data?.sector ?? '',
							direccion: data?.direccion ?? '',
							coordenadas: data?.coordenadas ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<ServicesInfo
						data={{
							router: data?.router ?? '',
							ipv4: data?.ipv4 ?? '',
							plan: data?.plan ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<BalanceInfo
						data={{
							saldo: data?.saldo ?? 0,
							fechaPago: data?.fechaPago ?? 0,
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<StatusInfo
						data={{
							saldo: data?.saldo ?? 0,
							estado: data?.estado ?? '',
							creadoPor: data?.creadoPor ?? '',
							fechaCreacion: data?.fechaCreacion ?? '',
							editadoPor: data?.editadoPor ?? '',
							fechaEdicion: data?.fechaEdicion ?? '',
							suspendidoPor: data?.suspendidoPor,
							fechaSuspension: data?.fechaSuspension ?? '',
							retiradoPor: data?.retiradoPor ?? '',
							fechaRetiro: data?.fechaRetiro ?? '',
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ClientDetailsCard;
