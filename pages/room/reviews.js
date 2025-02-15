import { Star } from 'lucide-react';
import React from 'react';

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

export function Reviews({ reviews }) {
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );


    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {sortedReviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
            ) : (
                sortedReviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-2">
                            <span className="font-semibold mr-4">{review.user?.first_name} {review.user?.last_name}</span>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`w-4 h-4 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 text-lg">{review.comment}</p>
                        <small className="text-gray-500 block mt-2">{formatDateTime(review.created_at)}</small>
                    </div>
                ))
            )}
        </div>
    );
}