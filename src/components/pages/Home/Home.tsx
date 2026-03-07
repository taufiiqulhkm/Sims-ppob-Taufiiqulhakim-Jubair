import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setProfile, setBalance, setError, setLoading } from "../../../store/slices/userSlice";
import { setServices, setBanners } from "../../../store/slices/informationSlice";
import Navbar from "../../ui/Navbar/Navbar";
import styles from "./Home.module.css";

const Home = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const { profile, balance } = useAppSelector((state) => state.user);
    const { services, banners } = useAppSelector((state) => state.information);
    const [showSaldo, setShowSaldo] = useState(false);
    const [imgError, setImgError] = useState(false);

    const hasImage = profile?.profile_image &&
        !profile.profile_image.includes('default') &&
        !imgError;

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            dispatch(setLoading(true));
            try {
                // Fetch Profile
                const profileRes = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = await profileRes.json();
                if (profileData.status === 0) dispatch(setProfile(profileData.data));

                // Fetch Balance
                const balanceRes = await fetch("https://take-home-test-api.nutech-integrasi.com/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const balanceData = await balanceRes.json();
                if (balanceData.status === 0) dispatch(setBalance(balanceData.data.balance));

                // Fetch Services
                const servicesRes = await fetch("https://take-home-test-api.nutech-integrasi.com/services", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const servicesData = await servicesRes.json();
                if (servicesData.status === 0) dispatch(setServices(servicesData.data));

                // Fetch Banners
                const bannersRes = await fetch("https://take-home-test-api.nutech-integrasi.com/banner", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const bannersData = await bannersRes.json();
                if (bannersData.status === 0) dispatch(setBanners(bannersData.data));

            } catch (err) {
                dispatch(setError("Gagal memuat data"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [token, dispatch]);

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount).replace("Rp", "Rp ");
    };

    const maskSaldo = "Rp ●●●●●●●";

    return (
        <div className={styles.homeContainer}>
            <Navbar />

            <main className={styles.homeContent}>
                {/* Header User Section */}
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

                {/* Services Section */}
                <section className={styles.servicesGrid}>
                    {[...services]
                        .sort((a, b) => {
                            const order = [
                                "PBB", "Listrik", "Pulsa", "PDAM", "PGN", "TV Langganan",
                                "Musik", "Voucher Game", "Voucher Makanan", "Kurban", "Zakat", "Paket Data"
                            ];
                            return order.indexOf(a.service_name) - order.indexOf(b.service_name);
                        })
                        .map((service) => (
                            <div key={service.service_code} className={styles.serviceItem}>
                                <img src={service.service_icon} alt={service.service_name} className={styles.serviceIcon} />
                                <span className={styles.serviceName}>{service.service_name}</span>
                            </div>
                        ))}
                </section>

                {/* Banner Promo Section */}
                <section className={styles.promoSection}>
                    <h3 className={styles.sectionTitle}>Temukan promo menarik</h3>
                    <div className={styles.bannerSlider}>
                        {banners.map((banner, index) => (
                            <div key={index} className={styles.bannerCard}>
                                <img src={banner.banner_image} alt={banner.banner_name} className={styles.bannerImage} />
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;