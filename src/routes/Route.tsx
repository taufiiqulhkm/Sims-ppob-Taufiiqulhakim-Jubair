import type { RouteObject } from "react-router-dom";
import Home from "../components/pages/Home";
import AuthPage from "../components/pages/Auth/AuthPage";
import ProfilePage from "../components/pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthPage />
    },
    {
        path: "/login",
        element: <AuthPage />
    },
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        )
    }
]

export default routes;