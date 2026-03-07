import type { RouteObject } from "react-router-dom";
import Home from "../components/pages/Home";
import AuthPage from "../components/pages/Auth/AuthPage";
import ProfilePage from "../components/pages/Profile/Profile";
import TopUpPage from "../components/pages/TopUp";
import PaymentPage from "../components/pages/Payment/Payment";
import TransactionPage from "../components/pages/Transaction/Transaction";
import ProtectedRoute from "./ProtectedRoute";

export const routes: RouteObject[] = [
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
    },
    {
        path: "/topup",
        element: (
            <ProtectedRoute>
                <TopUpPage />
            </ProtectedRoute>
        )
    },
    {
        path: "/transaction",
        element: (
            <ProtectedRoute>
                <TransactionPage />
            </ProtectedRoute>
        )
    },
    {
        path: "/payment/:serviceCode",
        element: (
            <ProtectedRoute>
                <PaymentPage />
            </ProtectedRoute>
        )
    }
]

export default routes;