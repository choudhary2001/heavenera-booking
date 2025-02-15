import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import ReusableModal from "components/Modal/ReusableModal";
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";
import { format } from "date-fns";
import clsx from 'clsx';

export default function Bookings() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, pageSize, searchQuery]);

    const fetchBookings = async () => {
        try {
            const response = await apiClient.get("/api/admin/bookings/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            setTotalCount(response.data.count);
            setTotalPages(Math.ceil(response.data.count / pageSize));
            const sortedBookings = response.data.results.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
            setBookings(sortedBookings);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);
        // Debounce the search
        const debounceTimeout = setTimeout(() => {
            fetchBookings();
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(debounceTimeout);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };


    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-2">
                {/* Bookings Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Bookings"
                        headers={[
                            "Booking ID",
                            "Room Name",
                            "User Name",
                            "Check-in Date",
                            "Check-out Date",
                            "Total Amount",
                            "Services",
                            "Payment Method",
                            "Status",
                            "Booking Time",
                        ]}
                        data={bookings.map((booking) => [
                            booking.id,
                            booking.room.room_name,
                            <div className="space-y-2">
                                <div>{booking.user.first_name} {booking.user.last_name}</div>
                                <div>{booking.user_phone}</div>
                                <div>{booking.user_name}</div>
                            </div>,
                            format(new Date(booking.check_in_date), 'dd/MM/yyyy'),
                            format(new Date(booking.check_out_date), 'dd/MM/yyyy'),
                            `₹${booking.total_amount}`,
                            <div className="space-y-2">
                                {booking.services.map((service, index) => (
                                    <div key={index}>{service.name} <small>(₹{service.price})</small></div>
                                ))}
                            </div>,
                            <div className={clsx({
                                'text-green-600': booking.payment_method === 'Online',
                                'text-yellow-600': booking.payment_method === 'Pending',
                                'text-gray-600': booking.payment_method === 'Cash',
                            })}>
                                {booking.payment_method}
                            </div>,
                            <div className={clsx({
                                'text-green-600': booking.status === 'Confirmed',
                                'text-yellow-600': booking.status === 'Pending',
                                'text-red-600': booking.status === 'Cancelled',
                            })}>
                                {booking.status}
                            </div>,
                            format(new Date(booking.requested_at), 'dd/MM/yyyy'),

                        ])}
                        actionButton={null}
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

Bookings.layout = Admin;
