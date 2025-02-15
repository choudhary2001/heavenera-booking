'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import { Star, MapPin } from 'lucide-react'
import baseURL from "../../url";
import * as FaIcons from "react-icons/fa"; // Import all Font Awesome icons
import * as TbIcons from "react-icons/tb"; // Import all Tailwind Icons
import { Skeleton } from "react-loading-skeleton";
import { FiUser, FiPhone } from "react-icons/fi"; // Import icons from react-icons

export function RoomCard({ room }) {
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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={`${baseURL}${room.main_image}`}
                alt={room.room_name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{room.room_name}</h3>
                <div className="flex items-center mb-2 text-sm text-gray-600">
                    <MapPin className="w-8 h-8 mr-1" />
                    {room.address}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    {room?.facilities?.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-1 border px-2 py-1 rounded-[14px]">
                            {allIcons.find((icon) => icon.name === facility.icon)?.reactIcon || ""}
                            <span className="text-sm text-gray-700 capitalize">{facility.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold">₹{room.price_per_night} &nbsp; <strike className="text-sm font-normal text-gray-600">₹{room.price_not_per_night}</strike><span className="text-sm font-normal text-gray-600">/ night</span></span>

                </div>

                <div className="flex justify-between items-center mb-2 w-full">
                    <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span>{room?.average_rating?.toFixed(1)}</span>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-sm ${room.status.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {room.status}
                    </span>
                </div>

                <div className="flex flex-col justify-between mb-2 w-full">
                    <div className="flex items-center">
                        <FiUser className="text-gray-500 text-lg" /> &nbsp;
                        <span>{room?.owner?.first_name} {room?.owner?.last_name}</span>
                    </div>

                    <a href={`tel:7357220325`} className={`flex items-center mt-2 rounded-full text-sm`}>
                        <FiPhone className="text-md" /> &nbsp;
                        7357220325
                    </a>
                </div>
            </div>
        </div>
    )
}

