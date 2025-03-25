import { useState } from "react";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Importar los items de navegación desde una constante
import { navigationItems } from "../constants/navigationItems";
import { useNavigate } from "react-router-dom";
import PerfilButton from "../components/perfil-botton";

const drawerWidth = 240;

const MainLayout = ({
    children,
    title = "Home",
}: {
    children: React.ReactNode;
    title: string;
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {navigationItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            selected={location.pathname === item.path}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh", // Asegura que el contenedor principal tenga al menos el 100% de la altura de la ventana
                bgcolor: "#f5f5f5", // Aplica el color de fondo gris a todo el contenedor principal
            }}
        >
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: "white",
                    color: "text.primary",
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {title}
                    </Typography>
                    <PerfilButton />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={() => setIsClosing(false)}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: "#f5f5f5",
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
