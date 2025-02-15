'use client';

import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import apiClient from '../../actions/axiosInterceptor';

export default function AddReviewForm({ roomId, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
    const user = useSelector((state) => state.auth.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await apiClient.post(`/api/reviews/save/${roomId}/`, {
                'rating': rating,
                'comment': comment
            });
            // Simulate API call
            console.log('Submitting review:', { roomId, rating, comment });
            // Reset form after submission
            setRating(0);
            setComment('');
            if (onReviewAdded) {
                onReviewAdded(); // Trigger refetching room data
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
                <p className="text-gray-700 mb-4">You must be logged in to leave a review.</p>
                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    onClick={() => {
                        // Redirect to login page
                        const currentUrl = encodeURIComponent(window.location.href);
                        window.location.href = `/auth/login?redirect=${currentUrl}`;
                    }}
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                            />
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
                    Comment
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={4}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
