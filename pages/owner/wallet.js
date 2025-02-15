import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Owner from "layouts/Owner.js";
import ReusableModal from "components/Modal/ReusableModal";
import Swal from "sweetalert2";
import clsx from 'clsx';
import { format } from "date-fns";
import { useSelector, useDispatch } from 'react-redux';

export default function Wallet() {
    const [wallet, setWallet] = useState({ balance: 0, total_earning: 0 });
    const [transactions, setTransactions] = useState([]);
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        fetchWalletData();
        fetchTransactionHistory();
    }, [currentPage, pageSize, searchQuery, role]); // Fetch data when page, page size, or search query changes

    const fetchWalletData = async () => {
        try {
            const response = await apiClient.get("/api/owner/wallet/");
            setWallet(response.data);
        } catch (error) {
            console.error("Error fetching wallet data:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch wallet data.",
                confirmButtonColor: "#EF4444",
            });
        }
    };

    const fetchTransactionHistory = async () => {
        try {
            const response = await apiClient.get("/api/owner/withdrawal/history/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery, // Pass the search query to the backend
                },
            });
            const sortedTransactions = response.data.results.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
            setTransactions(sortedTransactions);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch transaction history.",
                confirmButtonColor: "#EF4444",
            });
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        if (query === '') {
            setSearchQuery('');

        } else {

            setSearchQuery(query);
        }
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchTransactionHistory();
            setIsSearching(false);
        }, 500); // 500ms debounce delay

        return () => clearTimeout(debounceTimeout);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!withdrawalAmount || isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid Amount",
                text: "Please enter a valid withdrawal amount.",
                confirmButtonColor: "#EF4444",
            });
            return;
        }

        try {
            const response = await apiClient.post("/api/owner/withdrawal/history/", { amount: withdrawalAmount });
            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Withdrawal request created successfully.",
                    confirmButtonColor: "#10B981",
                });

                // Refresh data
                fetchWalletData();
                fetchTransactionHistory();
                // Close modal and reset withdrawal amount
                setIsModalOpen(false);
                setWithdrawalAmount("");
            }
        } catch (error) {
            console.error("Error creating withdrawal request:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "An error occurred during withdrawal.",
                confirmButtonColor: "#EF4444",
            });
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setWithdrawalAmount("");
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12">
                {/* Wallet Balance and Earnings Card */}
                <div
                    style={{
                        background: "linear-gradient(to right, #3b82f6, #9333ea)",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        padding: "2rem",
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative Circles */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-50px",
                            right: "-50px",
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.1)",
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-70px",
                            left: "-70px",
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.1)",
                        }}
                    ></div>

                    {/* Wallet Balance */}
                    <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9Z" />
                                <path d="M12 7v10" />
                                <path d="M9 10h6" />
                            </svg>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Wallet Balance</h2>
                        </div>
                        <p style={{ fontSize: "2.25rem", fontWeight: "700", background: "linear-gradient(to right, #ffffff, #e0e7ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            ₹{wallet.balance || 0}
                        </p>
                    </div>

                    {/* Total Earnings */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2v20" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Total Earnings</h2>
                        </div>
                        <p style={{ fontSize: "2.25rem", fontWeight: "700", background: "linear-gradient(to right, #ffffff, #e0e7ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            ₹{wallet.total_earning || 0}
                        </p>
                    </div>
                </div>

                {/* Withdrawal History Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Withdrawal History"
                        headers={["ID", "Amount", "Status", "Requested At", "Processed At"]}
                        data={transactions.map((transaction) => [
                            transaction.id,
                            `₹${transaction.amount}`,
                            <span
                                className={clsx(
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    {
                                        '!bg-yellow-100 text-yellow-700 border border-yellow-300': transaction.status === "Pending",
                                        '!bg-green-100 text-green-700 border border-green-300': transaction.status === "Completed",
                                        '!bg-red-100 text-red-700 border border-red-300': transaction.status !== "Pending" && transaction.status !== "Completed",
                                    }
                                )}
                            >
                                {transaction.status}
                            </span>,
                            format(new Date(transaction.requested_at), "yyyy-MM-dd HH:mm"),
                            format(new Date(transaction.processed_at), "yyyy-MM-dd HH:mm"),
                        ])}
                        actionButton={
                            <button
                                onClick={openModal}
                                style={{
                                    backgroundColor: "#10B981",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    fontWeight: "600",
                                    fontSize: "0.875rem",
                                    transition: "background-color 0.3s, transform 0.2s",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10B981")}
                            >
                                Request Withdrawal
                            </button>
                        }
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                </div>

                {/* Withdrawal Modal */}
                <ReusableModal
                    title="Request Withdrawal"
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText="Request Withdrawal"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                placeholder="Enter withdrawal amount"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                </ReusableModal>
            </div>
        </div>
    );
}

Wallet.layout = Owner;