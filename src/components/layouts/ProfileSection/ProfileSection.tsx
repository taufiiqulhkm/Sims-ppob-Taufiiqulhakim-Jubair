import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";
import styles from "./ProfileSection.module.css";

const ProfileSection = () => {
    const { profile, balance } = useAppSelector((state) => state.user);
    const [showSaldo, setShowSaldo] = useState(false);
    const [imgError, setImgError] = useState(false);

    const hasImage = profile?.profile_image &&
        !profile.profile_image.includes('default') &&
        !imgError;

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount).replace("Rp", "Rp ");
    };

    const maskSaldo = "Rp ● ● ● ● ● ● ●";

    return (
        <section className={styles.topSection}>
            <div className={styles.profileInfo}>
                {hasImage ? (
                    <img
                        src={profile!.profile_image}
                        alt="Profile"
                        className={styles.avatar}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={styles.initialsAvatar}>
                        {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : "U"}
                    </div>
                )}
                <p className={styles.welcomeText}>Selamat datang,</p>
                <h1 className={styles.userName}>
                    {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
                </h1>
            </div>

            {/* Balance Card Section */}
            <div className={styles.balanceCard}>
                <div>
                    <p className={styles.balanceLabel}>Saldo anda</p>
                    <h2 className={styles.balanceAmount}>
                        {showSaldo ? formatCurrency(balance) : maskSaldo}
                    </h2>
                </div>
                <button
                    className={styles.showBalanceBtn}
                    onClick={() => setShowSaldo(!showSaldo)}
                >
                    {showSaldo ? "Tutup Saldo" : "Lihat Saldo"}
                    {showSaldo ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>
        </section>
    );
};

export default ProfileSection;
