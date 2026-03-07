import { type ReactNode } from "react";
import styles from "../pages/Auth/Auth.module.css";
import authIllustration from "../../assets/Illustrasi_Login.png";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                {children}
            </div>
            <div className={styles.rightSide}>
                <img src={authIllustration} alt="Auth Illustration" className={styles.illustration} />
            </div>
        </div>
    );
};

export default AuthLayout;
