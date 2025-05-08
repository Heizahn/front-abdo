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
		ipv4: string;
		plan: string;
		idSubscription: string;
		type: string;
		mac: string;
		sn: string;
	};
}

const ServicesInfo: React.FC<ServicesInfoProps> = ({ data }) => {
	const { isEditing, clientUpdate } = useClientDetailsContext();

	const { data: planesList } = useFetchData<SelectList[]>('/plans/list', 'plans-list');

	return (
		<Box>
			<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
				Servicios
			</Typography>
			{!isEditing ? (
				<>
					<InfoField label='Plan' value={data.plan || 'N/A'} />
					<InfoField
						label='Tipo'
						value={data.type === 'RF' ? 'Radio Frecuencia' : 'Fibra Óptica'}
					/>
					{data.type === 'FO' && <InfoField label='SN' value={data.sn || 'N/A'} />}
					<InfoField
						label='IPv4'
						value={
							(data.ipv4 && (
								<Link href={`http://${data.ipv4}`} target='_blank'>
									{data.ipv4}
								</Link>
							)) ||
							'N/A'
						}
					/>
					{<InfoField label='MAC' value={data.mac || 'N/A'} />}
				</>
			) : (
				<>
					<EditableSelectField
						label='Plan'
						name='idSubscription'
						selectList={planesList || []}
						valueInitial={data.idSubscription}
					/>
					<EditableSelectField
						label='Tipo'
						valueInitial={data.type}
						name='sType'
						selectList={[
							{ sName: 'Fibra Óptica', id: 'FO' },
							{ sName: 'Radio Frecuencia', id: 'RF' },
						]}
					/>
					{(data.type === 'FO' || clientUpdate?.sType === 'FO') && (
						<EditableInfoField label='SN' valueInitial={data.sn} name='sSn' />
					)}
					<EditableInfoField
						label='IPv4'
						valueInitial={data.ipv4 || 'N/A'}
						name='sIp'
					/>

					<EditableInfoField label='MAC' valueInitial={data.mac} name='sMac' />
				</>
			)}
		</Box>
	);
};

export default ServicesInfo;
