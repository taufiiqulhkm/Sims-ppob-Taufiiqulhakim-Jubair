import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setLoading } from "../../../store/slices/userSlice";
import Navbar from "../../ui/Navbar/Navbar";
import ProfileSection from "../../layouts/ProfileSection";
import styles from "./Transaction.module.css";
import { userService } from "../../../services/user.service";

interface TransactionRecord {
    invoice_number: string;
    transaction_type: "TOPUP" | "PAYMENT";
    description: string;
    total_amount: number;
    created_on: string;
}

const TransactionPage = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const { loading } = useAppSelector((state) => state.user);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 5;

    const fetchTransactions = useCallback(async (currentOffset: number) => {
        if (!token) return;

        dispatch(setLoading(true));
        try {
            const response = await userService.getTransactionHistory(currentOffset, LIMIT);
            if (response.status === 0) {
                const newRecords = response.data.records;
                if (currentOffset === 0) {
                    setTransactions(newRecords);
                } else {
                    setTransactions((prev) => [...prev, ...newRecords]);
                }

                // If records returned are less than limit, no more data
                if (newRecords.length < LIMIT) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            dispatch(setLoading(false));
        }
    }, [token, dispatch]);

    useEffect(() => {
        fetchTransactions(0);
    }, [fetchTransactions]);

    const handleShowMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        fetchTransactions(nextOffset);
    };

    const handleShowLess = () => {
        setOffset(0);
        setHasMore(true);
        fetchTransactions(0);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(date).replace("pukul ", "");
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.content}>
                <ProfileSection />

                <section className={styles.titleSection}>
                    <h2 className={styles.title}>Semua Transaksi</h2>
                </section>

                <div className={styles.transactionList}>
                    {transactions.length > 0 ? (
                        <>
                            {transactions.map((item) => (
                                <div key={item.invoice_number} className={styles.transactionItem}>
                                    <div className={styles.itemHeader}>
                                        <span className={item.transaction_type === "TOPUP" ? styles.amountPositive : styles.amountNegative}>
                                            {item.transaction_type === "TOPUP" ? "+ " : "- "}
                                            Rp {item.total_amount.toLocaleString("id-ID")}
                                        </span>
                                        <span className={styles.itemDescription}>{item.description}</span>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <span className={styles.itemDate}>{formatDate(item.created_on)}</span>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.paginationActions}>
                                {hasMore ? (
                                    <button
                                        className={styles.showMoreBtn}
                                        onClick={handleShowMore}
                                        disabled={loading}
                                    >
                                        {loading ? "Memuat..." : "Show more"}
                                    </button>
                                ) : (
                                    offset > 0 && (
                                        <button
                                            className={styles.showLessBtn}
                                            onClick={handleShowLess}
                                            disabled={loading}
                                        >
                                            Show less
                                        </button>
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        !loading && (
                            <div className={styles.emptyState}>
                                <p>Maaf tidak ada histori transaksi saat ini</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default TransactionPage;
