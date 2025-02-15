import { RoomCard } from './room-card'
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import Link from 'next/link';

export default function RoomList({ rooms, currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, isLoading }) {
    if (isLoading) {
        return (
            <div>
                {/* Skeleton Loading for the Room List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6" aria-label="List of rooms">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            {/* Image Skeleton */}
                            <div className="w-full h-48 bg-gray-200"></div>

                            {/* Content Skeleton */}
                            <div className="p-4">
                                {/* Room Name Skeleton */}
                                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>

                                {/* Address Skeleton with Icon */}
                                <div className="flex items-center mb-4">
                                    <div className="h-6 w-6 bg-gray-200 rounded-full mr-2"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                                </div>

                                {/* Facilities Skeleton */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                </div>

                                {/* Price and Status Skeleton */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                </div>

                                {/* Rating Skeleton */}
                                <div className="flex items-center">
                                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-8"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <Skeleton width={65} height={30} />
                    <div className="flex items-center justify-center gap-2">
                        <Skeleton width={40} height={30} />
                        <Skeleton width={40} height={30} />
                        <Skeleton width={40} height={30} />
                        <Skeleton width={40} height={30} />
                    </div>
                </div>
            </div>
        );
    }
    if (rooms && rooms.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-xl text-gray-600">No rooms found matching your criteria.</p>
            </div>
        )
    }
    const MAX_PAGES_TO_SHOW = 5; // Number of pages to show at a time

    // Generate the range of pages to display
    const getPageRange = () => {
        const half = Math.floor(MAX_PAGES_TO_SHOW / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + MAX_PAGES_TO_SHOW - 1);

        if (end - start + 1 < MAX_PAGES_TO_SHOW) {
            start = Math.max(1, end - MAX_PAGES_TO_SHOW + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageRange = getPageRange();


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6" aria-label="List of rooms">
                {rooms && rooms.map((room) => (
                    <Link key={room.id} href={`/room/${room.id}`} className="block">
                        <RoomCard key={room.id} room={room} />
                    </Link>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
                {/* Page Size Dropdown */}
                <div>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm cursor-pointer"
                        style={{ width: "65px" }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {pageRange.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-2 py-1 text-sm font-medium ${page === currentPage
                                ? "bg-lightblue-500 text-gray-700"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                                } border border-gray-300 rounded-md`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Ellipsis for Remaining Pages */}
                    {totalPages > MAX_PAGES_TO_SHOW && pageRange[pageRange.length - 1] < totalPages && (
                        <span className="px-2 py-1 text-sm text-gray-700">...</span>
                    )}

                    {/* Last Page Button */}
                    {totalPages > MAX_PAGES_TO_SHOW && pageRange[pageRange.length - 1] < totalPages && (
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`px-2 py-1 text-sm font-medium ${totalPages === currentPage
                                ? "bg-red-500 text-gray-700"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                                } border border-gray-300 rounded-md`}
                        >
                            {totalPages}
                        </button>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}