import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
}

const Button = ({
    children,
    type = "button",
    variant = "primary",
    fullWidth = true,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    const combinedClassName = `
        ${styles.button} 
        ${variant === "primary" ? styles.primary : styles.secondary} 
        ${className || ""}
    `.trim();

    return (
        <button
            type={type}
            disabled={disabled}
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;