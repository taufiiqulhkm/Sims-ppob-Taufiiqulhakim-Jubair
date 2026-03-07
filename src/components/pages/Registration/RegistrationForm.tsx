import { Lock, User, AtSign } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { setLoading } from "../../../store/slices/authSlice";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Logo from "../../ui/Logo/Logo";
import Alert from "../../ui/Alert/Alert";
import styles from "../Auth/Auth.module.css";
import { authService } from "../../../services/auth.service";

interface RegistrationFormProps {
    onToggle: () => void;
}

const RegistrationForm = ({ onToggle }: RegistrationFormProps) => {
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const first_name = (form.elements.namedItem('first_name') as HTMLInputElement).value;
        const last_name = (form.elements.namedItem('last_name') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const confirm_password = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

        if (password !== confirm_password) {
            setFormError("Konfirmasi password tidak sesuai");
            return;
        }

        dispatch(setLoading(true));
        try {
            const data = await authService.register({ email, first_name, last_name, password });
            if (data.status === 0) {
                setFormSuccess(data.message);
                // Beri jeda sedikit agar user bisa baca pesan sukses sebelum pindah ke login
                setTimeout(() => {
                    onToggle();
                }, 2000);
            } else {
                setFormError(data.message);
            }
        } catch (err) {
            setFormError("Terjadi kesalahan koneksi");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <Logo className="justify-center" />
                <h1 className={styles.title}>Lengkapi data untuk membuat akun</h1>
            </div>

            <form onSubmit={handleRegister}>
                <Input
                    name="email"
                    id="email"
                    placeholder="masukan email anda"
                    type="email"
                    icon={<AtSign size={18} />}
                    required
                />
                <Input
                    name="first_name"
                    id="first_name"
                    placeholder="nama depan"
                    icon={<User size={18} />}
                    required
                />
                <Input
                    name="last_name"
                    id="last_name"
                    placeholder="nama belakang"
                    icon={<User size={18} />}
                    required
                />
                <Input
                    name="password"
                    id="password"
                    placeholder="buat password"
                    type="password"
                    icon={<Lock size={18} />}
                    required
                    minLength={8}
                />
                <Input
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="konfirmasi password"
                    type="password"
                    icon={<Lock size={18} />}
                    required
                    minLength={8}
                />

                <Button type="submit">Registrasi</Button>
            </form>

            <div className={styles.footer}>
                sudah punya akun? login{" "}
                <span className={styles.toggleLink} onClick={onToggle}>
                    di sini
                </span>
            </div>

            {formError && (
                <Alert message={formError} onClose={() => setFormError(null)} />
            )}

            {formSuccess && (
                <Alert
                    message={formSuccess}
                    type="success"
                    onClose={() => setFormSuccess(null)}
                />
            )}
        </div>
    );
};

export default RegistrationForm;
