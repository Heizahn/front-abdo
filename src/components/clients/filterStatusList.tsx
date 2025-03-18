import FilterStatusButton from './filterStatus';

type FilterStatusListProps = {
	clientStats: {
		total: number;
		activos: number;
		morosos: number;
		suspendidos: number;
		retirados: number;
	};
	clientStatsFiltered: {
		todos: boolean;
		solventes: boolean;
		morosos: boolean;
		suspendidos: boolean;
		retirados: boolean;
	};
	setClientStatsFiltered: React.Dispatch<
		React.SetStateAction<{
			todos: boolean;
			solventes: boolean;
			morosos: boolean;
			suspendidos: boolean;
			retirados: boolean;
		}>
	>;
};

export default function FilterStatusList({
	clientStats,
	clientStatsFiltered,
	setClientStatsFiltered,
}: FilterStatusListProps) {
	return (
		<>
			<FilterStatusButton
				title='Todos'
				clientStats={clientStats.total}
				color='#1976d2'
				active={clientStatsFiltered.todos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Solventes'
				clientStats={clientStats.activos}
				color='#2e7d32'
				active={clientStatsFiltered.solventes}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Morosos'
				clientStats={clientStats.morosos}
				color='#ed6c02'
				active={clientStatsFiltered.morosos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Suspendidos'
				clientStats={clientStats.suspendidos}
				color='#d32f2f'
				active={clientStatsFiltered.suspendidos}
				setClientStatsFiltered={setClientStatsFiltered}
			/>

			<FilterStatusButton
				title='Retirados'
				clientStats={clientStats.retirados}
				color='#757575'
				active={clientStatsFiltered.retirados}
				setClientStatsFiltered={setClientStatsFiltered}
			/>
		</>
	);
}
