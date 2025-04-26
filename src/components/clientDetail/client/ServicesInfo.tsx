import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoField from '../common/InfoField';
import { Link } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import EditableSelectField from '../common/EditableSelectfield';
import { useFetchData } from '../../../hooks/useQuery';
import { SelectList } from '../../../interfaces/types';
import EditableInfoField from '../common/EditableInfoField';

interface ServicesInfoProps {
	data: {
		router: string;
		ipv4: string;
		plan: string;
	};
}

const ServicesInfo: React.FC<ServicesInfoProps> = ({ data }) => {
	const { isEditing } = useClientDetailsContext();

	const { data: routerList } = useFetchData<SelectList[]>('/routersList', 'routersList');
	const { data: planesList } = useFetchData<SelectList[]>('/plansList', 'plansList');

	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Servicios
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Router' value={data.router || 'N/A'} />
					<InfoField
						label='IPv4'
						value={
							(data && (
								<Link href={`http://${data.ipv4}`} target='_blank'>
									{data.ipv4}
								</Link>
							)) ||
							'N/A'
						}
					/>
					<InfoField label='Plan' value={data.plan || 'N/A'} />
				</>
			) : (
				<>
					<EditableSelectField
						label='Router'
						selectList={routerList || []}
						valueInitial={data.router || 'N/A'}
						name='routersId'
					/>

					<EditableInfoField
						label='IPv4'
						valueInitial={data.ipv4 || 'N/A'}
						name='ipv4'
					/>

					<EditableSelectField
						label='Plan'
						name='planesId'
						selectList={planesList || []}
						valueInitial={data.plan || 'N/A'}
					/>
				</>
			)}
		</Box>
	);
};

export default ServicesInfo;
