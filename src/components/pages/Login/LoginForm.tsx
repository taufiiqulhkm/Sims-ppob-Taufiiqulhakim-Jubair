import { Lock, AtSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/redux";
import { setToken, setLoading } from "../../../store/slices/authSlice";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Logo from "../../ui/Logo/Logo";
import Alert from "../../ui/Alert/Alert";
import styles from "../Auth/Auth.module.css";

interface LoginFormProps {
    onToggle: () => void;
}

const LoginForm = ({ onToggle }: LoginFormProps) => {
    const [formError, setFormError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        dispatch(setLoading(true));
        try {
            const response = await fetch('https://take-home-test-api.nutech-integrasi.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.status === 0) {
                dispatch(setToken(data.data.token));
                navigate('/home');
            } else {
                setFormError("password yang anda masukan salah");
                setPasswordError(true);
            }
        } catch (err) {
            setFormError("Terjadi kesalahan koneksi");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const [passwordError, setPasswordError] = useState(false);

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <Logo className="justify-center" />
                <h1 className={styles.title}>Masuk atau buat akun untuk memulai</h1>
            </div>

            <form onSubmit={handleLogin}>
                <Input
                    name="email"
                    id="email"
                    placeholder="masukan email anda"
                    type="email"
                    icon={<AtSign size={18} />}
                    required
                />
                <Input
                    name="password"
                    id="password"
                    placeholder="masukan password anda"
                    type="password"
                    icon={<Lock size={18} />}
                    required
                    error={passwordError ? " " : undefined} // Hanya ambil efek border merah tanpa teks di bawahnya
                    onChange={() => setPasswordError(false)}
                />

                <Button type="submit">Masuk</Button>
            </form>

            <div className={styles.footer}>
                belum punya akun? registrasi{" "}
                <span className={styles.toggleLink} onClick={onToggle}>
                    di sini
                </span>
            </div>

            {formError && (
                <Alert
                    message={formError}
                    onClose={() => {
                        setFormError(null);
                        setPasswordError(false);
                    }}
                />
            )}
        </div>
    );
};

export default LoginForm;
