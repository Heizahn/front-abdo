import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRouter() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated()) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}
