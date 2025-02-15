'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import baseURL from "../../url";

export default function ImageSlider({ mainImage, additionalImages }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [mainImage, ...additionalImages.map(img => img.image)].map((image) => `${baseURL}${image}`);


    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full" style={{ maxHeight: '600px' }}>
            <img
                src={images[currentIndex] || ''}
                alt={`Room image ${currentIndex + 1}`}

                className="object-cover rounded-lg"
                style={{ maxHeight: '600px', width: "100%" }}
            />
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}