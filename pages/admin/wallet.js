import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import Swal from "sweetalert2";
import clsx from 'clsx';
import { format } from "date-fns";

export default function Wallet() {
    const [wallet, setWallet] = useState({ balance: 0, total_earning: 0 });
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchWalletData();
        fetchTransactionHistory();
    }, [currentPage, pageSize, searchQuery]);

    const fetchWalletData = async () => {
        try {
            const response = await apiClient.get("/api/admin/wallets/");
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
            const response = await apiClient.get("/api/admin/withdrawals/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            console.log(response)
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
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);

        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1);
            fetchTransactionHistory();
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    };

    const handleApprove = async (withdrawalId) => {
        try {
            await apiClient.put(`/api/admin/withdrawals/${withdrawalId}/`, { status: "Approved" });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Withdrawal request approved successfully.",
                confirmButtonColor: "#10B981",
            });
            fetchTransactionHistory(); // Refresh the table
        } catch (error) {
            console.error("Error approving withdrawal:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to approve withdrawal request.",
                confirmButtonColor: "#EF4444",
            });
        }
    };

    const handleCancel = async (withdrawalId) => {
        try {
            await apiClient.put(`/api/admin/withdrawals/${withdrawalId}/`, { status: "Rejected" });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Withdrawal request cancelled successfully.",
                confirmButtonColor: "#10B981",
            });
            fetchTransactionHistory(); // Refresh the table
        } catch (error) {
            console.error("Error cancelling withdrawal:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to cancel withdrawal request.",
                confirmButtonColor: "#EF4444",
            });
        }
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
                    {/* Wallet Balance */}

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
                            ₹{wallet.balance || 0}
                        </p>
                    </div>
                </div>

                {/* Withdrawal History Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Withdrawal History"
                        headers={["ID", "User", "Bank Details", "Amount", "Current Balance", "Total Earning", "Status", "Requested At", "Processed At", "Actions"]}
                        data={transactions.map((transaction) => [
                            transaction.id,
                            `${transaction.wallet.user.first_name} ${transaction.wallet.user.last_name}`,
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Bank Name</p>
                                        <p className="font-medium">{transaction.wallet.user.bank_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Account Holder Name</p>
                                        <p className="font-medium">{transaction.wallet.user.account_holder_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Account Number</p>
                                        <p className="font-medium">{transaction.wallet.user.account_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">IFSC Code</p>
                                        <p className="font-medium">{transaction.wallet.user.ifsc_code}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Branch Name</p>
                                        <p className="font-medium">{transaction.wallet.user.branch_name}</p>
                                    </div>
                                </div>
                            </div>,
                            `₹${transaction.amount}`,
                            `₹${transaction.wallet.balance}`, // Display current balance
                            `₹${transaction.wallet.total_earning}`, // Display current balance
                            <span
                                className={clsx(
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    {
                                        '!bg-yellow-100 text-yellow-700 border border-yellow-300': transaction.status === "Pending",
                                        '!bg-green-100 text-green-700 border border-green-300': transaction.status === "Approved",
                                        '!bg-red-100 text-red-700 border border-red-300': transaction.status === "Rejected",
                                    }
                                )}
                            >
                                {transaction.status}
                            </span>,
                            format(new Date(transaction.requested_at), "yyyy-MM-dd HH:mm"),
                            format(new Date(transaction.processed_at), "yyyy-MM-dd HH:mm"),
                            <div className="space-x-2">
                                {transaction.status === "Pending" ? (
                                    <>
                                        <button
                                            onClick={() => handleApprove(transaction.id)}
                                            className="px-4 py-2 text-white font-semibold rounded-md bg-green-600 hover:bg-green-700 transition duration-300"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleCancel(transaction.id)}
                                            className="px-4 py-2 text-white font-semibold rounded-md bg-red-600 hover:bg-red-700 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : null}

                            </div>,
                        ])}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                </div>
            </div>
        </div>
    );
}

Wallet.layout = Admin;