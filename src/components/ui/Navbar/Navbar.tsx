import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import styles from "../../pages/Home/Home.module.css";

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <NavLink to="/home" style={{ textDecoration: 'none' }}>
                <Logo />
            </NavLink>
            <div className={styles.navLinks}>
                <NavLink
                    to="/topup"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                    Top Up
                </NavLink>
                <NavLink
                    to="/transaction"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                    Transaction
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                    Akun
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
