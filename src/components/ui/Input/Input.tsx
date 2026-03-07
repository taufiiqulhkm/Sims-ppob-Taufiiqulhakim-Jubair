import { type InputHTMLAttributes, type ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

const Input = ({
    label,
    icon,
    error,
    type = "text",
    className,
    id,
    ...props
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`${styles.inputWrapper} ${className || ""}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputContainer}>
                {icon && (
                    <div className={styles.icon}>
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    type={inputType}
                    className={`
                        ${styles.input} 
                        ${icon ? styles.withIcon : ""} 
                        ${isPassword ? styles.withPassword : ""} 
                        ${error ? styles.errorInput : ""}
                    `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeButton}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Input;