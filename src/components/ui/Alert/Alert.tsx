import { X } from "lucide-react";
import styles from "../../pages/Auth/Auth.module.css";

interface AlertProps {
    message: string;
    onClose: () => void;
    type?: "error" | "success";
}

const Alert = ({ message, onClose, type = "error" }: AlertProps) => {
    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div className={styles.notificationWrapper}>
            <div className={`${styles.notification} ${isSuccess ? styles.successNotification : ""}`}>
                <span className={`${styles.notificationContent} ${isSuccess ? styles.successContent : ""}`}>
                    {message}
                </span>
                <button
                    onClick={onClose}
                    className={`${styles.closeButton} ${isSuccess ? styles.successCloseButton : ""}`}
                >
                    <X size={14} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

export default Alert;
