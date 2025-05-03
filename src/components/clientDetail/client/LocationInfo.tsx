import { Box, Link, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import EditableInfoField from '../common/EditableInfoField';
import { useFetchData } from '../../../hooks/useQuery';
import { SelectList } from '../../../interfaces/types';
import EditableSelectField from '../common/EditableSelectfield';

interface LocationInfoProps {
	data: {
		sector: string;
		direccion: string;
		coordenadas: string;
		idSector: string;
	};
}
const LocationInfo = ({ data }: LocationInfoProps) => {
	const { isEditing } = useClientDetailsContext();

	const { data: sectoresList } = useFetchData<SelectList[]>('/sectors/list', 'sectors-list');

	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Ubicación
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Sector' value={data.sector || 'No asignado'} />
					<InfoField label='Dirección' value={data.direccion} />
					<InfoField
						label='Coordenadas'
						value={
							data.coordenadas ? (
								<Link
									href={`https://maps.google.com/?q=${data.coordenadas}`}
									target='_blank'
								>
									{data.coordenadas}
								</Link>
							) : (
								'N/A'
							)
						}
					/>
				</>
			) : (
				<>
					<EditableSelectField
						label='Sector'
						name='idSector'
						selectList={sectoresList || []}
						valueInitial={data.idSector}
					/>
					<EditableInfoField
						label='Dirección'
						valueInitial={data.direccion}
						name='sAddress'
						multiline={true}
					/>
					<EditableInfoField
						label='Coordenadas'
						valueInitial={data.coordenadas || 'N/A'}
						name='sGps'
					/>
				</>
			)}
		</Box>
	);
};

export default LocationInfo;
