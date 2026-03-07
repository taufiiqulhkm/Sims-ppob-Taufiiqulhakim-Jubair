import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Banknote } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setBalance, setLoading } from "../../../store/slices/userSlice";
import Navbar from "../../ui/Navbar/Navbar";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal";
import Logo from "../../ui/Logo/Logo";
import ProfileSection from "../../layouts/ProfileSection";
import styles from "./Payment.module.css";
import { userService } from "../../../services/user.service";
import { CheckCircle2, XCircle } from "lucide-react";

const PaymentPage = () => {
    const { serviceCode } = useParams<{ serviceCode: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.auth);
    const { loading } = useAppSelector((state) => state.user);
    const { services } = useAppSelector((state) => state.information);
    const [modalState, setModalState] = useState<{
        type: "none" | "confirm" | "success" | "error";
        message?: string;
    }>({ type: "none" });

    const service = services.find((s) => s.service_code === serviceCode);

    useEffect(() => {
        if (!service && services.length > 0) {
            navigate("/home");
        }
    }, [service, services, navigate]);

    // Auto-hide result modals after 5 seconds
    useEffect(() => {
        if (modalState.type === "success" || modalState.type === "error") {
            const timer = setTimeout(() => {
                setModalState({ type: "none" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [modalState.type]);

    const handlePaymentClick = () => {
        setModalState({ type: "confirm" });
    };

    const confirmPayment = async () => {
        if (!serviceCode || !token) return;

        setModalState({ type: "none" });
        dispatch(setLoading(true));
        try {
            const response = await userService.transaction(serviceCode);
            if (response.status === 0) {
                // Refetch balance
                const balanceData = await userService.getBalance();
                if (balanceData.status === 0) {
                    dispatch(setBalance(balanceData.data.balance));
                }
                setModalState({
                    type: "success",
                    message: "Berhasil!"
                });
            } else {
                setModalState({ type: "error", message: response.message });
            }
        } catch (err) {
            setModalState({ type: "error", message: "Terjadi kesalahan saat memproses pembayaran" });
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!service) return null;

    return (
        <div className={styles.paymentContainer}>
            <Navbar />

            {/* Confirmation Modal */}
            <Modal isOpen={modalState.type === "confirm"} onClose={() => setModalState({ type: "none" })}>
                <div className={styles.modalContent}>
                    <Logo className={styles.modalLogo} />
                    <p className={styles.modalSubtitle}>Beli {service.service_name} senilai</p>
                    <h2 className={styles.modalAmount}>
                        Rp {service.service_tariff.toLocaleString("id-ID")} ?
                    </h2>
                    <button className={styles.confirmBtn} onClick={confirmPayment}>
                        Ya, lanjutkan Bayar
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setModalState({ type: "none" })}>
                        Batalkan
                    </button>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal isOpen={modalState.type === "success"} onClose={() => setModalState({ type: "none" })}>
                <div className={styles.modalContent}>
                    <div className={styles.iconSuccess}>
                        <CheckCircle2 size={64} color="white" fill="#00C853" />
                    </div>
                    <p className={styles.modalSubtitle}>Bayar {service.service_name} senilai</p>
                    <h2 className={styles.modalAmount}>
                        Rp {service.service_tariff.toLocaleString("id-ID")}
                    </h2>
                    <p className={styles.modalStatusText}>berhasil!</p>
                    <button className={styles.backBtn} onClick={() => navigate("/home")}>
                        Kembali ke Beranda
                    </button>
                </div>
            </Modal>

            {/* Error Modal */}
            <Modal isOpen={modalState.type === "error"} onClose={() => setModalState({ type: "none" })}>
                <div className={styles.modalContent}>
                    <div className={styles.iconError}>
                        <XCircle size={64} color="white" fill="#F42619" />
                    </div>
                    <p className={styles.modalSubtitle}>Bayar {service.service_name} senilai</p>
                    <h2 className={styles.modalAmount}>
                        Rp {service.service_tariff.toLocaleString("id-ID")}
                    </h2>
                    <p className={styles.modalStatusText}>gagal!</p>
                    <p className={styles.errorMessage}>{modalState.message}</p>
                    <button className={styles.backBtn} onClick={() => setModalState({ type: "none" })}>
                        Kembali ke Beranda
                    </button>
                </div>
            </Modal>

            <main className={styles.paymentContent}>
                <ProfileSection />

                <section className={styles.serviceInfo}>
                    <p className={styles.subtitle}>PemBayaran</p>
                    <div className={styles.serviceDetail}>
                        <img src={service.service_icon} alt={service.service_name} className={styles.serviceIcon} />
                        <h1 className={styles.serviceName}>{service.service_name}</h1>
                    </div>
                </section>

                <div className={styles.inputWrapper}>
                    <Input
                        value={`Rp ${service.service_tariff.toLocaleString("id-ID")}`}
                        disabled
                        icon={<Banknote size={18} />}
                    />
                </div>

                <Button
                    onClick={handlePaymentClick}
                    disabled={loading}
                    className={styles.payBtn}
                >
                    {loading ? "Memproses..." : "Bayar"}
                </Button>
            </main>
        </div>
    );
};

export default PaymentPage;
