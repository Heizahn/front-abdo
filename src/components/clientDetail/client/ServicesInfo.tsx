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
	const { isEditing } = useClientDetailsContext();

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
					{data.sn && data.type === 'FO' && <InfoField label='SN' value={data.sn} />}
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
					{data.mac && <InfoField label='MAC' value={data.mac} />}
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
					{data.type === 'FO' && (
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
