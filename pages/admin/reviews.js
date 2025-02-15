import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Link from 'next/link';

export default function Reviews() {
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [currentPage, pageSize, searchQuery]);

    const fetchReviews = async () => {
        try {
            const response = await apiClient.get("/api/admin/reviews/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            setTotalCount(response.data.count);
            setTotalPages(Math.ceil(response.data.count / pageSize));
            const sortedReviews = response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setReviews(sortedReviews);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);
        // Debounce the search
        const debounceTimeout = setTimeout(() => {
            fetchReviews();
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

    const handleDeleteReview = async (reviewId) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await apiClient.delete(`/api/admin/reviews/${reviewId}/`);
                Swal.fire("Deleted!", "Your review has been deleted.", "success");
                fetchReviews(); // Refresh the reviews list
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            Swal.fire("Error", "Failed to delete the review.", "error");
        }
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-2">
                {/* Reviews Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="My Reviews"
                        headers={[
                            "Review ID",
                            "Room Name",
                            "Rating",
                            "Comment",
                            "Created At",
                            "Actions",
                        ]}
                        data={reviews.map((review) => [
                            review.id,
                            <Link key={review.room.id} href={`/room/${review.room.id}`}>
                                {review.room.room_name}
                            </Link>,
                            <div className="flex items-center">
                                <span className="mr-2">{review.rating}</span>
                                <div className="text-yellow-500">
                                    {Array.from({ length: review.rating }, (_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>,
                            review.comment,
                            format(new Date(review.created_at), 'dd/MM/yyyy'),
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>,
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

Reviews.layout = Admin;