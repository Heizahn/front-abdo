import { useClients } from "../../context/ClientsContext";
import FilterStatusButton from "./filterStatus";

export default function FilterStatusList() {
    const { clientStats, clientStatsFiltered, setClientStatsFiltered } =
        useClients();
    return (
        <>
            <FilterStatusButton
                title="Todos"
                clientStats={clientStats.todos}
                color="#1976d2"
                active={clientStatsFiltered.todos}
                setClientStatsFiltered={setClientStatsFiltered}
            />

            <FilterStatusButton
                title="Solventes"
                clientStats={clientStats.solventes}
                color="#2e7d32"
                active={clientStatsFiltered.solventes}
                setClientStatsFiltered={setClientStatsFiltered}
            />

            <FilterStatusButton
                title="Morosos"
                clientStats={clientStats.morosos}
                color="#ed6c02"
                active={clientStatsFiltered.morosos}
                setClientStatsFiltered={setClientStatsFiltered}
            />

            <FilterStatusButton
                title="Suspendidos"
                clientStats={clientStats.suspendidos}
                color="#d32f2f"
                active={clientStatsFiltered.suspendidos}
                setClientStatsFiltered={setClientStatsFiltered}
            />

            <FilterStatusButton
                title="Retirados"
                clientStats={clientStats.retirados}
                color="#757575"
                active={clientStatsFiltered.retirados}
                setClientStatsFiltered={setClientStatsFiltered}
            />
        </>
    );
}
