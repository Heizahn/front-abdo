import React, {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from "react";
import { Client } from "../interfaces/Interfaces";
import { useFetchData } from "../hooks/useQuery";

const ClientsContext = createContext({
    clients: [] as Client[],
    clientsRemoved: [] as Client[],
    filteredClients: () => [] as Client[],
    searchTerms: "",
    setSearchTerms: () => {},
    clientStats: {
        todos: 0,
        solventes: 0,
        morosos: 0,
        suspendidos: 0,
        retirados: 0,
    },
    clientStatsFiltered: {
        todos: true,
        solventes: false,
        morosos: false,
        suspendidos: false,
        retirados: false,
    },
    setClientStatsFiltered: () => {},
    paginatedClients: () => [] as Client[],
    setClientStats: () => {},
    handleChangePage: () => {},
    handleChangeRowsPerPage: () => {},
    page: 0,
    rowsPerPage: 20,
    handleSearchChange: () => {},
});

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [clients, setClients] = useState<Client[]>([]);
    const [clientsRemoved, setClientsRemoved] = useState<Client[]>([]);
    const [searchTerms, setSearchTerms] = useState("");
    const [clientStats, setClientStats] = useState({
        todos: 0,
        solventes: 0,
        morosos: 0,
        suspendidos: 0,
        retirados: 0,
    });
    const [clientStatsFiltered, setClientStatsFiltered] = useState({
        todos: true,
        solventes: false,
        morosos: false,
        suspendidos: false,
        retirados: false,
    });
    // Manejar cambio en la búsqueda
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerms(event.target.value);
        setPage(0); // Reset page when search changes
    };

    // Manejar cambio de página
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Manejar cambio de filas por página
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const filteredClients = () => {
        let filtered = clients.filter(
            (client) =>
                client.nombre
                    .toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.identificacion
                    .toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.telefonos
                    .toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.sector
                    .toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.router
                    ?.toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.ipv4
                    ?.toLowerCase()
                    .includes(searchTerms.toLowerCase()) ||
                client.plan.toLowerCase().includes(searchTerms.toLowerCase())
        );

        // Luego filtramos por estado, solo si no está seleccionado "todos"
        if (!clientStatsFiltered.todos) {
            filtered = filtered?.filter((client) => {
                if (
                    clientStatsFiltered.solventes &&
                    client.estado === "Activo" &&
                    client.saldo >= 0
                )
                    return true;
                if (
                    clientStatsFiltered.morosos &&
                    client.estado === "Activo" &&
                    client.saldo < 0
                )
                    return true;
                if (
                    clientStatsFiltered.suspendidos &&
                    client.estado === "Suspendido"
                )
                    return true;
                if (clientStatsFiltered.retirados && clientsRemoved?.length > 0)
                    return true;
                return false;
            });
        }

        return clientStatsFiltered.retirados ? clientsRemoved : filtered;
    };

    const paginatedClients = () => {
        const filtered = filteredClients();
        return filtered?.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    };

    const { data } = useFetchData<[{ clients: Array<Client> }]>(
        "/clientsAllInfo",
        "clientsAllInfo"
    );

    const { data: dataRetired } = useFetchData<
        [{ clientsRetired: Array<Client> }]
    >("/clientsRemovedInfo", "clientsRemovedInfo");

    useEffect(() => {
        if (data) {
            setClients(data[0].clients);
            setClientsRemoved(dataRetired?.[0]?.clientsRetired ?? []);
            setClientStats({
                todos: data[0].clients.length,
                solventes: data[0].clients.filter(
                    (client) => client.estado === "Activo" && client.saldo >= 0
                ).length,
                morosos: data[0].clients.filter((client) => client.saldo < 0)
                    .length,
                suspendidos: data[0].clients.filter(
                    (client) => client.estado === "Suspendido"
                ).length,
                retirados: dataRetired?.[0]?.clientsRetired.length ?? 0,
            });
            setClientStatsFiltered({
                todos: true,
                solventes: false,
                morosos: false,
                suspendidos: false,
                retirados: false,
            });
        }
    }, [data, dataRetired]);

    return (
        <ClientsContext.Provider
            value={{
                clients,
                filteredClients,
                searchTerms,
                setSearchTerms,
                clientStats,
                clientStatsFiltered,
                setClientStatsFiltered,
                paginatedClients,
                handleSearchChange,
                handleChangePage,
                handleChangeRowsPerPage,
                page,
                rowsPerPage,
            }}
        >
            {children}
        </ClientsContext.Provider>
    );
};

export const useClients = () => useContext(ClientsContext);
