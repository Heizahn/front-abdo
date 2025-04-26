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
	};
}
const LocationInfo = ({ data }: LocationInfoProps) => {
	const { isEditing } = useClientDetailsContext();

	const { data: sectoresList } = useFetchData<SelectList[]>('/sectorsList', 'sectorsList');

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
						name='sectoresId'
						selectList={sectoresList || []}
						valueInitial={data.sector}
					/>
					<EditableInfoField
						label='Dirección'
						valueInitial={data.direccion}
						name='direccion'
					/>
					<EditableInfoField
						label='Coordenadas'
						valueInitial={data.coordenadas || 'N/A'}
						name='coordenadas'
					/>
				</>
			)}
		</Box>
	);
};

export default LocationInfo;
