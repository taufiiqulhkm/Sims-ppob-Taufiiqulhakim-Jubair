import { useState, useRef, useEffect } from "react";
import { User, AtSign, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setProfile, setLoading, setError } from "../../../store/slices/userSlice";
import { logout } from "../../../store/slices/authSlice";
import Navbar from "../../ui/Navbar/Navbar";
import Input from "../../ui/Input/Input";
import styles from "./Profile.module.css";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useAppSelector((state) => state.user);
    const { token } = useAppSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
    });

    const hasImage = profile?.profile_image &&
        !profile.profile_image.includes('default') &&
        !imgError;

    // Sinkronisasi formData saat profile tersedia dan TIDAK dalam mode edit
    useEffect(() => {
        if (profile && !isEditing) {
            setFormData({
                first_name: profile.first_name,
                last_name: profile.last_name,
            });
        }
    }, [profile, isEditing]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogout = () => {
        dispatch(logout());
        dispatch({ type: 'user/clearUser' });
        navigate("/login");
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        dispatch(setLoading(true));
        try {
            const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.status === 0) {
                dispatch(setProfile(data.data));
                setIsEditing(false);
            } else {
                dispatch(setError(data.message));
            }
        } catch (err) {
            dispatch(setError("Gagal memperbarui profil"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        // Validasi ukuran file (100KB)
        if (file.size > 100 * 1024) {
            alert("Ukuran file maksimal 100 KB");
            return;
        }

        const formDataImage = new FormData();
        formDataImage.append("file", file);

        dispatch(setLoading(true));
        try {
            const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/image", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataImage,
            });
            const data = await response.json();
            if (data.status === 0) {
                dispatch(setProfile(data.data));
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Gagal mengupload foto");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.profileContainer}>
                {/* Avatar Section */}
                <div className={styles.avatarSection}>
                    {hasImage ? (
                        <img
                            src={profile!.profile_image}
                            alt="Profile"
                            className={styles.avatarLarge}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className={styles.initialsAvatarLarge}>
                            {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : "U"}
                        </div>
                    )}
                    <button
                        className={styles.editAvatarBtn}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Pencil size={14} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.fileInput}
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                    />
                </div>

                <h1 className={styles.userNameLarge}>
                    {profile?.first_name} {profile?.last_name}
                </h1>

                <form onSubmit={handleUpdateProfile} className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Email</label>
                        <Input
                            value={profile?.email || ""}
                            disabled
                            icon={<AtSign size={18} />}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Nama Depan</label>
                        <Input
                            value={isEditing ? formData.first_name : profile?.first_name || ""}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            disabled={!isEditing}
                            icon={<User size={18} />}
                            placeholder="nama depan"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Nama Belakang</label>
                        <Input
                            value={isEditing ? formData.last_name : profile?.last_name || ""}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            disabled={!isEditing}
                            icon={<User size={18} />}
                            placeholder="nama belakang"
                            required
                        />
                    </div>

                    <div className={styles.actionButtons}>
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (profile) {
                                            setFormData({
                                                first_name: profile.first_name,
                                                last_name: profile.last_name
                                            });
                                        }
                                        setIsEditing(true);
                                    }}
                                    className={styles.editBtn}
                                >
                                    Edit Profile
                                </button>
                                <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="submit" className={styles.saveBtn} disabled={loading}>
                                    {loading ? "Menyimpan..." : "Simpan"}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                                    Batalkan
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
