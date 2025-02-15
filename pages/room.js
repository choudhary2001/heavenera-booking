import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import FilterSidebar from 'components/Rooms/filter-sidebar';
import RoomList from 'components/Rooms/room-list';
import { Filter } from 'lucide-react';
import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { FaLocationArrow, FaSearch } from 'react-icons/fa'; // Import an icon for current location
import { SET_LOCATION } from './../actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '../actions/axiosInterceptor';

export default function Rooms() {
    const [isClient, setIsClient] = useState(false); // Track if it's client-side
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading
    const [facilitiesList, setFacilitiesList] = useState([]); // List of all facilities
    const [categoriesList, setCategoriesList] = useState([]); // List of all services
    const [actualMinPrice, setActualMinPrice] = useState(0);
    const [actualMaxPrice, setActualMaxPrice] = useState(0);

    const lat = useSelector((state) => state.auth.lat);
    const lng = useSelector((state) => state.auth.lng);

    // Only run on client side
    useEffect(() => {
        setIsClient(true); // Set client flag
    }, []);

    // useEffect(() => {
    //     if (lat && lng) {
    //         setSelectedLocation({ lat, lng });
    //         const results = getGeocode({ location: { lat: lat, lng: lng } });
    //         setValue(results[0]?.formatted_address || "");
    //     }
    // }, [lat, lng]);


    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 999999,
        ratings: [],
        facilities: [],
        categories: [],
    });

    useEffect(() => {
        // Simulate a 2-second delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Cleanup the timer to avoid memory leaks
        return () => clearTimeout(timer);
    }, []);

    const dispatch = useDispatch();

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [activeSuggestion, setActiveSuggestion] = useState(0); // Tracks keyboard selection

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    dispatch({
                        type: SET_LOCATION,
                        payload: { lat: position.coords.latitude, lng: position.coords.longitude },
                    });
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    }, []); // Empty dependency array ensures this runs once on mount

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300 });

    const handleInput = (e) => {
        setValue(e.target.value);
        setActiveSuggestion(0); // Reset selection on input change
    };

    const handleKeyDown = (e) => {
        if (status !== "OK") return;

        if (e.key === "ArrowDown") {
            setActiveSuggestion((prev) => (prev + 1) % data.length);
        } else if (e.key === "ArrowUp") {
            setActiveSuggestion((prev) => (prev - 1 + data.length) % data.length);
        } else if (e.key === "Enter") {
            handleSelect(data[activeSuggestion]?.description || value);
        }
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            dispatch({
                type: SET_LOCATION,
                payload: { lat: lat, lng: lng },
            });
            setSelectedLocation({ lat, lng });
        } catch (error) {
            console.error("Error selecting location:", error);
        }
    };

    const handleCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({
                        lat: latitude,
                        lng: longitude,
                    });
                    dispatch({
                        type: SET_LOCATION,
                        payload: { lat: latitude, lng: longitude },
                    });
                    try {
                        const results = await getGeocode({ location: { lat: latitude, lng: longitude } });
                        setValue(results[0]?.formatted_address || "");
                        setSelectedLocation(null); // Clear the selected location on current location click
                    } catch (error) {
                        console.error("Error fetching address for current location:", error);
                    }
                },
                (error) => console.error("Error getting current location:", error)
            );
        }
    };

    const handleSearch = () => {
        if (value) {
            console.log(value);
            handleSelect(value); // Trigger search manually based on input
        }
    };

    // Fetch rooms with filters
    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get("/api/rooms/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                    min_price: filters.minPrice,
                    max_price: filters.maxPrice === 999999 ? null : filters.maxPrice,
                    ratings: filters.ratings,
                    facilities: filters.facilities,
                    categories: filters.categories,
                    latitude: selectedLocation?.lat,
                    longitude: selectedLocation?.lng,
                    roomType: filters.roomType,
                    roomFor: filters.roomFor,
                },
            });
            console.log(response.data);
            setActualMinPrice(response.data.min_price || 0);
            setActualMaxPrice(response.data.max_price || 999999);
            setTotalPages(response.data.pagination?.total_pages || 0);
            setRooms(response.data.rooms || []);
            setFilteredRooms(response.data.rooms || []); // Initialize filtered rooms
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
        setCurrentPage(1); // Reset to page 1 when filters change
    };

    // Apply filters when filters state changes
    useEffect(() => {
        fetchRooms();
    }, [filters, currentPage, pageSize, searchQuery, currentLocation, selectedLocation]);

    // Fetch categories and facilities on mount
    useEffect(() => {
        fetchCategories();
        fetchFacilities();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get("/api/categories/list/");
            setCategoriesList(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchFacilities = async () => {
        try {
            const response = await apiClient.get("/api/facilities/list/");
            setFacilitiesList(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };


    if (!isClient) {
        return null; // Prevent rendering on the server-side
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 pt-6 pb-12">
                <button
                    className="lg:hidden bg-blue-500 text-white p-2 rounded-md fixed top-[90px] right-0 z-9999"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    aria-label="Toggle filters"
                >
                    <Filter className="w-6 h-6 z-9999" />
                </button>

                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <FilterSidebar
                            onFilterChange={handleFilterChange}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            facilitiesList={facilitiesList}
                            categoriesList={categoriesList}
                            actualMinPrice={actualMinPrice}
                            actualMaxPrice={actualMaxPrice}
                        />
                        <div className="flex-1">
                            <div className="mb-4 mx-auto container">
                                <LoadScriptNext
                                    googleMapsApiKey="AIzaSyCLp0BWj-PHv0RtwuxrUxvItuDiVVsa-TY"
                                    libraries={['places']}
                                >
                                    {/* Input Box with Location Icon */}
                                    <div className="relative">
                                        <input
                                            value={value}
                                            onChange={handleInput}
                                            onKeyDown={handleKeyDown}
                                            disabled={!ready}
                                            placeholder="Search a location"
                                            className="rounded-lg p-3 pl-5 pr-25  focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-full md:w-4/5 lg:w-3/4 h-[50px]"
                                            style={{ width: "calc(100% - 65px)" }}
                                        />

                                        {/* Current Location Icon */}
                                        <button
                                            onClick={handleCurrentLocation}
                                            className="absolute  transform  text-blue-500 hover:text-blue-700 transition duration-200"
                                            style={{ marginLeft: "-30px", marginTop: "15px", outline: "none" }}
                                        >
                                            <FaLocationArrow size={20} />
                                        </button>

                                        {/* Search Icon */}
                                        <button
                                            onClick={handleSearch}
                                            className="absolute transform  text-blue-500 hover:text-blue-700 transition duration-200 bg-white p-4 ml-2 rounded-lg h-[50px]"
                                            style={{ outline: "none", width: "auto" }}
                                        >
                                            <FaSearch size={20} />
                                        </button>
                                    </div>

                                    {/* Suggestions List */}
                                    {status === "OK" && (
                                        <ul className="border border-gray-300 mt-1 max-h-60 overflow-y-auto bg-white w-full shadow-md rounded">
                                            {data.map((suggestion, index) => (
                                                <li
                                                    key={suggestion.place_id}
                                                    className={`px-4 py-2 cursor-pointer ${index === activeSuggestion ? "bg-red-400 text-white" : "bg-white text-black"
                                                        }`}
                                                    onMouseEnter={() => setActiveSuggestion(index)}
                                                    onClick={() => handleSelect(suggestion.description)}
                                                >
                                                    {suggestion.description}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </LoadScriptNext>
                            </div>
                            <RoomList
                                rooms={filteredRooms}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
