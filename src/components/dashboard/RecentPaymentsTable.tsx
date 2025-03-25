import {
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useFetchData } from "../../hooks/useQuery";
import { LastPays } from "../../interfaces/Interfaces";

const RecentPaymentsTable = () => {
    const { data, isLoading, error } = useFetchData<LastPays[]>(
        "/lastPays",
        "lastPays"
    );

    if (error) {
        return <div>Hubo un error al cargar los pagos</div>;
    }

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <Paper sx={{ width: "100%" }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" id="tableTitle" component="div">
                    {"Últimos Pagos"}
                </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 503, overflowY: "auto" }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: 650 }}
                    aria-label="payments table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Motivo</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>USD</TableCell>
                            <TableCell>VES</TableCell>
                            <TableCell>Tipo de Pago</TableCell>
                            <TableCell>Referencia</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.motivo}
                                </TableCell>
                                <TableCell>{row.cliente}</TableCell>
                                <TableCell>{row.fecha}</TableCell>
                                <TableCell>{row.montoUSD.toFixed(2)}</TableCell>
                                <TableCell>{row.montoVES.toFixed(2)}</TableCell>
                                <TableCell>{row.tipoPago}</TableCell>
                                <TableCell>{row.referencia}</TableCell>
                                <TableCell>
                                    {row.estado === "Activo" ? (
                                        <Typography color="success">
                                            Activo
                                        </Typography>
                                    ) : (
                                        <Typography color="error">
                                            Inactivo
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default RecentPaymentsTable;
