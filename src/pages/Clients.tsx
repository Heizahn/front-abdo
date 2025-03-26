import { Box, Typography, Button } from "@mui/material";
import MainLayout from "../layouts/MainLayout";

import TableClients from "../components/clients/TableClients";
import FilterStatusList from "../components/clients/filterStatusList";
import SearchInput from "./SearchInput";
import { ClientsProvider } from "../context/ClientsContext";

export default function Clients() {
    return (
        <MainLayout title="Clientes">
            <ClientsProvider>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        height: "95%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "background.default",
                            paddingRight: 4,
                            paddingBottom: 0.2,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    >
                        <Box sx={{ display: "flex", mb: 1, gap: 1 }}>
                            <FilterStatusList />
                        </Box>

                        <Button color="primary" variant="contained">
                            Crear
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography variant="h6">Clientes</Typography>
                        <SearchInput />
                    </Box>

                    <TableClients />
                </Box>
            </ClientsProvider>
        </MainLayout>
    );
}
