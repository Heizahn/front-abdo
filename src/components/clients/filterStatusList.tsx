import { Stack } from '@mui/material';
import { useClients } from '../../context/ClientsContext';
import { useFetchData } from '../../hooks/useQuery';
import FilterStatusButton from './filterStatus';
import FilterStatusSkeleton from '../skeletons/FilterStatusSkeleton';

export default function FilterStatusList() {
	const { clientStatsFiltered, setClientStatsFiltered } = useClients();

	const { data, isLoading } = useFetchData<{
		todos: number;
		solventes: number;
		morosos: number;
		suspendidos: number;
		retirados: number;
	}>('/clientsStats', 'clientsStats');

	if (isLoading) {
		return (
			<Stack direction='row' spacing={1} flexWrap='wrap'>
				{Array.from(new Array(5)).map((_, index) => (
					<FilterStatusSkeleton key={index} />
				))}
			</Stack>
		);
	}

	return (
		<>
			<FilterStatusButton
				title='Todos'
				clientStats={data?.todos || 0}
				color='#1976d2'
				active={clientStatsFiltered.todos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Solventes'
				clientStats={data?.solventes || 0}
				color='#2e7d32'
				active={clientStatsFiltered.solventes}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Morosos'
				clientStats={data?.morosos || 0}
				color='#ed6c02'
				active={clientStatsFiltered.morosos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Suspendidos'
				clientStats={data?.suspendidos || 0}
				color='#d32f2f'
				active={clientStatsFiltered.suspendidos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Retirados'
				clientStats={data?.retirados || 0}
				color='#757575'
				active={clientStatsFiltered.retirados}
				setClientStatsFiltered={setClientStatsFiltered}
			/>
		</>
	);
}
