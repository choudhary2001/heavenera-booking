'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from "next/navigation";
import { Search, X, Star } from 'lucide-react'
import * as FaIcons from "react-icons/fa"; // Import all Font Awesome icons
import * as TbIcons from "react-icons/tb"; // Import all Tailwind Icons

export function FilterSidebar({ onFilterChange, isOpen, onClose, facilitiesList, categoriesList, actualMinPrice, actualMaxPrice }) {
    const [type, setType] = useState('') // Room type filter
    const [priceRange, setPriceRange] = useState([0, 999999]) // Price range filter
    const [selectedRatings, setSelectedRatings] = useState([]) // Multiple ratings filter
    const [selectedFacilities, setSelectedFacilities] = useState([]) // Facilities filter
    const [selectedCategories, setSelectedCategories] = useState([]) // Multiple categories filter
    const [selectedRoomType, setselectedRoomType] = useState([]) // Multiple categories filter
    const [selectedRoomForType, setselectedRoomForType] = useState([]) // Multiple categories filter

    const searchParams = useSearchParams();
    const roomForFromUrl = searchParams.get("room_for");

    useEffect(() => {
        if (roomForFromUrl) {
            setselectedRoomForType([roomForFromUrl]);
        }
    }, [roomForFromUrl]);

    const allIcons = [
        ...Object.keys(FaIcons).map((iconName) => ({
            name: iconName,
            reactIcon: React.createElement(FaIcons[iconName]),
            source: "React Icons",
        })),
        ...Object.keys(TbIcons).map((iconName) => ({
            name: iconName,
            reactIcon: React.createElement(TbIcons[iconName]),
            source: "Tailwind Icons",
        })),
    ];

    useEffect(() => {
        setPriceRange([actualMinPrice, actualMaxPrice])
    }, [actualMinPrice, actualMaxPrice])
    // Handle filter changes
    useEffect(() => {
        handleFilterChange()
    }, [type, priceRange, selectedRatings, selectedFacilities, selectedCategories, selectedRoomType, selectedRoomForType])

    const handleFilterChange = () => {
        onFilterChange({
            type,
            minPrice: priceRange[0], // send the lower bound of the price range
            maxPrice: priceRange[1], // send the upper bound of the price range
            ratings: selectedRatings, // Pass selected ratings
            facilities: selectedFacilities,
            categories: selectedCategories, // Pass selected categories
            roomType: selectedRoomType, // Pass selected categories
            roomFor: selectedRoomForType // Pass selected categories
        })
    }

    // Handle rating selection
    const handleRatingChange = (rating) => {
        setSelectedRatings((prev) =>
            prev.includes(rating)
                ? prev.filter((r) => r !== rating) // Remove rating
                : [...prev, rating] // Add rating
        )
    }

    // Handle facility selection
    const handleFacilityChange = (facilityId) => {
        setSelectedFacilities((prev) =>
            prev.includes(facilityId)
                ? prev.filter((id) => id !== facilityId) // Remove facility
                : [...prev, facilityId] // Add facility
        )
    }

    // Handle category selection
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Remove category
                : [...prev, categoryId] // Add category
        )
    }

    const handleRoomChange = (Id) => {
        setselectedRoomType((prev) =>
            prev.includes(Id)
                ? prev.filter((id) => id !== Id)
                : [...prev, Id]
        )
    }

    const handleRoomTypeChange = (Id) => {
        console.log(Id);
        setselectedRoomForType((prev) =>
            prev.includes(Id)
                ? prev.filter((id) => id !== Id)
                : [...prev, Id]
        )
        console.log(selectedRoomForType);
    }

    const roomTypeList = [
        {
            id: '1BHK',
            name: '1BHK'
        },
        {
            id: '2BHK',
            name: '2BHK'
        },
        {
            id: '3BHK',
            name: '3BHK'
        },
        {
            id: '4BHK',
            name: '4BHK'
        },
        {
            id: '5BHK',
            name: '5BHK'
        },
    ]

    return (
        <div className={`fixed inset-y-0 left-0 z-50 max-h-[100vh] w-64 bg-white rounded-lg shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            <div className="p-4 overflow-y-auto max-h-[100vh]">
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-6">
                    {/* Price Range Filter */}
                    <div>
                        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                            Price Range
                        </label>
                        <input
                            type="range"
                            id="priceRange"
                            min={actualMinPrice}
                            max={actualMaxPrice}
                            step="10"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        {roomTypeList.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center cursor-pointer"
                                onClick={() => handleRoomChange(r.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRoomType.includes(r.id)}
                                    readOnly
                                    className="mr-2"
                                />
                                <span>{r.name}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room For</label>

                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleRoomTypeChange('Students')}
                        >
                            <input
                                type="checkbox"
                                checked={selectedRoomForType.includes('Students')}
                                readOnly
                                className="mr-2"
                            />
                            <span>Students</span>
                        </div>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleRoomTypeChange('Commercial')}
                        >
                            <input
                                type="checkbox"
                                checked={selectedRoomForType.includes('Commercial')}
                                readOnly
                                className="mr-2"
                            />
                            <span>Commercial</span>
                        </div>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleRoomTypeChange('Residential')}
                        >
                            <input
                                type="checkbox"
                                checked={selectedRoomForType.includes('Residential')}
                                readOnly
                                className="mr-2"
                            />
                            <span>Residential</span>
                        </div>

                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        {categoriesList.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center cursor-pointer"
                                onClick={() => handleCategoryChange(category.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    readOnly
                                    className="mr-2"
                                />
                                <span>{category.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Facilities Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                        {facilitiesList.map((facility) => (
                            <div
                                key={facility.id}
                                className="flex items-center cursor-pointer"
                                onClick={() => handleFacilityChange(facility.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFacilities.includes(facility.id)}
                                    readOnly
                                    className="mr-2"
                                />
                                <span className='flex items-center'>
                                    {allIcons.find((icon) => icon.name === facility.icon)?.reactIcon || ""}
                                    &nbsp;{facility.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                                key={rating}
                                className="flex items-center cursor-pointer"
                                onClick={() => handleRatingChange(rating)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRatings.includes(rating)}
                                    readOnly
                                    className="mr-2"
                                />
                                {[...Array(rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 mr-1" />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check In Features</label>

                        <div
                            className="flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"

                                readOnly
                                className="mr-2"
                            />
                            Pay at location
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}
