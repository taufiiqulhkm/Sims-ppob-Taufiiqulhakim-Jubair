import { X } from "lucide-react";
import styles from "../../pages/Auth/Auth.module.css";

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert = ({ message, onClose }: AlertProps) => {
    if (!message) return null;

    return (
        <div className={styles.notificationWrapper}>
            <div className={styles.notification}>
                <span className={styles.notificationContent}>{message}</span>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={14} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

export default Alert;
