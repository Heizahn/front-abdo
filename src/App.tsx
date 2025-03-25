import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Router from "./router/Router";
import { AuthProvider } from "./context/AuthContext";

// Define un tema personalizado (opcional, puedes ajustarlo según tus necesidades)
const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#ed6c02",
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
