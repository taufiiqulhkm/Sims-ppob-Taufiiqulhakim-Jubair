import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../Login/LoginForm";
import RegistrationForm from "../Registration/RegistrationForm";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <AuthLayout>
            {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
                <RegistrationForm onToggle={() => setIsLogin(true)} />
            )}
        </AuthLayout>
    );
};

export default AuthPage;
