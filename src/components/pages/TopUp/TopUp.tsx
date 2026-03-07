import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, CheckCircle2, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setBalance, setLoading } from "../../../store/slices/userSlice";
import Navbar from "../../ui/Navbar/Navbar";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal";
import Logo from "../../ui/Logo/Logo";
import ProfileSection from "../../layouts/ProfileSection";
import styles from "./TopUp.module.css";
import { userService } from "../../../services/user.service";

const TopUpPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.auth);
    const { loading } = useAppSelector((state) => state.user);
    const [amount, setAmount] = useState<string>("");
    const [isValid, setIsValid] = useState(false);
    const [modalState, setModalState] = useState<{
        type: "none" | "confirm" | "success" | "error";
        message?: string;
        finalAmount?: number;
    }>({ type: "none" });

    const numAmount = useMemo(() => parseInt(amount.replace(/[^0-9]/g, "")) || 0, [amount]);

    const presetNominals = [10000, 20000, 50000, 100000, 250000, 500000];

    useEffect(() => {
        setIsValid(numAmount >= 10000 && numAmount <= 1000000);
    }, [numAmount]);

    const handlePresetClick = (val: number) => {
        setAmount(val.toString());
    };

    // Auto-hide result modals after 5 seconds (longer for better readability)
    useEffect(() => {
        if (modalState.type === "success" || modalState.type === "error") {
            const timer = setTimeout(() => {
                setModalState({ type: "none" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [modalState.type]);

    const handleTopUpClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setModalState({ type: "confirm" });
    };

    const confirmTopUp = async () => {
        if (!isValid || !token) return;

        setModalState({ type: "none" });
        dispatch(setLoading(true));
        try {
            const response = await userService.topUp(numAmount);
            if (response.status === 0) {
                // Success
                dispatch(setBalance(response.data.balance));
                setModalState({
                    type: "success",
                    message: `Berhasil!`,
                    finalAmount: numAmount
                });
                setAmount("");
            } else {
                setModalState({
                    type: "error",
                    message: response.message,
                    finalAmount: numAmount
                });
            }
        } catch (err) {
            setModalState({
                type: "error",
                message: "Gagal memproses top up",
                finalAmount: numAmount
            });
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className={styles.topUpContainer}>
            <Navbar />

            {/* Confirmation Modal */}
            <Modal isOpen={modalState.type === "confirm"} onClose={() => setModalState({ type: "none" })}>
                <div className={styles.modalContent}>
                    <Logo className={styles.modalLogo} />
                    <p className={styles.modalSubtitle}>Anda yakin untuk Top Up sebesar</p>
                    <h2 className={styles.modalAmount}>
                        Rp {numAmount.toLocaleString("id-ID")} ?
                    </h2>
                    <button className={styles.confirmBtn} onClick={confirmTopUp}>
                        Ya, lanjutkan Top Up
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
                    <p className={styles.modalSubtitle}>Top Up sebesar</p>
                    <h2 className={styles.modalAmount}>
                        Rp {modalState.finalAmount?.toLocaleString("id-ID")}
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
                    <p className={styles.modalSubtitle}>Top Up sebesar</p>
                    <h2 className={styles.modalAmount}>
                        Rp {modalState.finalAmount?.toLocaleString("id-ID")}
                    </h2>
                    <p className={styles.modalStatusText}>gagal!</p>
                    <p className={styles.errorMessage}>{modalState.message}</p>
                    <button className={styles.backBtn} onClick={() => setModalState({ type: "none" })}>
                        Kembali ke Beranda
                    </button>
                </div>
            </Modal>

            <main className={styles.topUpContent}>
                <ProfileSection />

                <section className={styles.titleSection}>
                    <p className={styles.subtitle}>Silahkan masukan</p>
                    <h1 className={styles.title}>Nominal Top Up</h1>
                </section>

                <div className={styles.mainLayout}>
                    <form onSubmit={handleTopUpClick} className={styles.formSection}>
                        <div className={styles.inputWrapper}>
                            <Input
                                placeholder="masukan nominal Top Up"
                                value={amount ? `Rp ${parseInt(amount).toLocaleString("id-ID")}` : ""}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                                    setAmount(rawValue);
                                }}
                                icon={<Banknote size={18} />}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!isValid || loading}
                            variant={isValid ? "primary" : "secondary"}
                        >
                            {loading ? "Memproses..." : "Top Up"}
                        </Button>
                    </form>

                    <div className={styles.nominalSection}>
                        <div className={styles.nominalGrid}>
                            {presetNominals.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    className={`${styles.nominalBtn} ${parseInt(amount) === val ? styles.nominalBtnActive : ""}`}
                                    onClick={() => handlePresetClick(val)}
                                >
                                    Rp {val.toLocaleString("id-ID")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default TopUpPage;
