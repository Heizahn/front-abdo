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
							nombre: data?.sName ?? '',
							dni: data?.sDni ?? '',
							rif: data?.sRif ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<ContactInfo
						data={{
							telefonos: data?.sPhone ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<LocationInfo
						data={{
							sector: data?.sector ?? '',
							direccion: data?.sAddress ?? '',
							coordenadas: data?.sGps ?? '',
							idSector: data?.idSector ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<ServicesInfo
						data={{
							type: data?.sType as 'RF' | 'FO',
							mac: data?.sMac ?? '',
							sn: data?.sSn ?? '',
							ipv4: data?.sIp ?? '',
							plan:
								data?.plan && data?.nMBPS
									? `${data?.plan} (${data?.nMBPS} Mbps)`
									: '',
							idSubscription: data?.idSubscription ?? '',
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<BalanceInfo
						data={{
							saldo: data?.nBalance ?? 0,
							fechaPago: data?.nPayment ?? 0,
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<StatusInfo
						data={{
							saldo: data?.nBalance ?? 0,
							estado: data?.sState ?? '',
							creadoPor: data?.creator ?? '',
							fechaCreacion: data?.dCreation ?? '',
							editadoPor: data?.editor ?? '',
							fechaEdicion: data?.dEdition ?? '',
							suspendidoPor: data?.suspender ?? '',
							fechaSuspension: data?.dSuspension ?? '',
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ClientDetailsCard;
