import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setProfile, setBalance, setError, setLoading } from "../../../store/slices/userSlice";
import { setServices, setBanners } from "../../../store/slices/informationSlice";
import Navbar from "../../ui/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { userService } from "../../../services/user.service";
import { informationService } from "../../../services/information.service";
import ProfileSection from "../../layouts/ProfileSection";

const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.auth);
    const { services, banners } = useAppSelector((state) => state.information);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            dispatch(setLoading(true));
            try {
                // Fetch Profile
                const profileData = await userService.getProfile();
                if (profileData.status === 0) dispatch(setProfile(profileData.data));

                // Fetch Balance
                const balanceData = await userService.getBalance();
                if (balanceData.status === 0) dispatch(setBalance(balanceData.data.balance));

                // Fetch Services
                const servicesData = await informationService.getServices();
                if (servicesData.status === 0) dispatch(setServices(servicesData.data));

                // Fetch Banners
                const bannersData = await informationService.getBanners();
                if (bannersData.status === 0) dispatch(setBanners(bannersData.data));

            } catch (err) {
                dispatch(setError("Gagal memuat data"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [token, dispatch]);



    return (
        <div className={styles.homeContainer}>
            <Navbar />

            <main className={styles.homeContent}>
                {/* Header User & Balance Section */}
                <ProfileSection />

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
                            <div
                                key={service.service_code}
                                className={styles.serviceItem}
                                onClick={() => navigate(`/payment/${service.service_code}`)}
                            >
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