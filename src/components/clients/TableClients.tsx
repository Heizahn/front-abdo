import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { getStateComponent } from "./ClientStatus";
import {
    Edit as EditIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { Client } from "../../interfaces/Interfaces";
import { useClients } from "../../context/ClientsContext";

export default function TableClients() {
    const {
        paginatedClients,
        filteredClients,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
    } = useClients();
    return (
        <Paper
            sx={{
                flexGrow: 1,
                overflow: "hidden",
                boxShadow: "none",
                border: "1px solid rgba(224, 224, 224, 1)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TableContainer sx={{ flexGrow: 1, height: "calc(100vh - 80rem)" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Identificación</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Router</TableCell>
                            <TableCell>IPv4</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Saldo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center" width={100}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedClients().map((client: Client) => (
                            <TableRow
                                key={client.id}
                                hover
                                sx={{
                                    borderLeft:
                                        client.estado === "Moroso"
                                            ? "4px solid #ed6c02"
                                            : client.estado === "Activo" &&
                                              client.saldo === 0
                                            ? "4px solid #2e7d32"
                                            : client.estado === "Activo"
                                            ? "4px solid #ed6c02"
                                            : client.estado === "Suspendido"
                                            ? "4px solid #d32f2f"
                                            : "none",
                                }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        fontWeight:
                                            client.estado === "Suspendido"
                                                ? "normal"
                                                : "medium",
                                        color:
                                            client.estado === "Suspendido"
                                                ? "text.secondary"
                                                : "inherit",
                                    }}
                                >
                                    {client.nombre}
                                </TableCell>
                                <TableCell>{client.identificacion}</TableCell>
                                <TableCell>{client.telefonos}</TableCell>
                                <TableCell>{client.sector}</TableCell>
                                <TableCell>{client.router}</TableCell>
                                <TableCell>{client.ipv4}</TableCell>
                                <TableCell>{client.plan}</TableCell>
                                <TableCell
                                    sx={{
                                        color:
                                            client.saldo < 0
                                                ? "error.main"
                                                : "success.main",
                                    }}
                                >
                                    {client.saldo}
                                </TableCell>
                                <TableCell>
                                    {getStateComponent(client.estado)}
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <IconButton size="small">
                                            <EditIcon
                                                fontSize="small"
                                                color="primary"
                                            />
                                        </IconButton>

                                        {client.estado === "Suspendido" ? (
                                            <IconButton size="small">
                                                <CheckIcon
                                                    fontSize="small"
                                                    color="success"
                                                />
                                            </IconButton>
                                        ) : null}

                                        <IconButton size="small">
                                            <DeleteIcon
                                                fontSize="small"
                                                color="error"
                                            />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            <TablePagination
                component="div"
                count={filteredClients().length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                }
            />
        </Paper>
    );
}
