import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useClients } from "../context/ClientsContext";

export default function SearchInput() {
    const { searchTerms, handleSearchChange } = useClients();
    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
                placeholder="Buscar"
                variant="outlined"
                size="small"
                value={searchTerms}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}
