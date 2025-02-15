import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Owner from "layouts/Owner.js";
import ReusableModal from "components/Modal/ReusableModal";
import MultiSelectDropdownWithSearch from "components/Dropdowns/MultiSelectDropdownWithSearch";
import dynamic from "next/dynamic";
import Map from "components/Map/Map.js";
import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { FaLocationArrow, FaSearch } from 'react-icons/fa'; // Import an icon for current location
import { SET_LOCATION } from '../../actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import baseURL from "../../url";
import Swal from "sweetalert2";
import clsx from 'clsx';
import { format } from "date-fns";
import Link from 'next/link';


export default function Room() {
    const dispatch = useDispatch();

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [activeSuggestion, setActiveSuggestion] = useState(0); // Tracks keyboard selection
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    const latitude = position.coords.longitude;
                    const longitude = position.coords.longitude;
                    setFormData((prev) => ({
                        ...prev,
                        latitude,
                        longitude,
                    }));
                    const results = getGeocode({ location: { lat: latitude, lng: longitude } });
                    setFormData((prev) => ({
                        ...prev,
                        address: results[0]?.formatted_address || "",
                    }));
                    results[0]?.address_components.forEach((component) => {
                        if (component.types.includes("locality")) {
                            setFormData((prev) => ({
                                ...prev,
                                city: component.long_name || "",
                            }));
                        }
                        if (component.types.includes("administrative_area_level_1")) {
                            setFormData((prev) => ({
                                ...prev,
                                state: component.long_name || "",
                            }));
                        }
                        if (component.types.includes("country")) {
                            setFormData((prev) => ({
                                ...prev,
                                country: component.long_name || "",
                            }));
                        }
                        if (component.types.includes("postal_code")) {
                            setFormData((prev) => ({
                                ...prev,
                                postal_code: component.long_name || "",
                            }));
                        }
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

            setFormData((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
            }));
            const aresults = await getGeocode({ location: { lat: lat, lng: lng } });
            setFormData((prev) => ({
                ...prev,
                address: aresults[0]?.formatted_address || "",
            }));
            aresults[0]?.address_components.forEach((component) => {
                if (component.types.includes("locality")) {
                    setFormData((prev) => ({
                        ...prev,
                        city: component.long_name || "",
                    }));
                }
                if (component.types.includes("administrative_area_level_1")) {
                    setFormData((prev) => ({
                        ...prev,
                        state: component.long_name || "",
                    }));
                }
                if (component.types.includes("country")) {
                    setFormData((prev) => ({
                        ...prev,
                        country: component.long_name || "",
                    }));
                }
                if (component.types.includes("postal_code")) {
                    setFormData((prev) => ({
                        ...prev,
                        postal_code: component.long_name || "",
                    }));
                }
            });
            setSelectedLocation({ lat, lng });
        } catch (error) {
            console.error("Error selecting location:", error);
        }
    };

    const handleMapClick = async (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        dispatch({
            type: SET_LOCATION,
            payload: { lat: lat, lng: lng },
        });
        try {
            const results = await getGeocode({ location: { lat, lng } });

            setFormData((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
            }));
            setFormData((prev) => ({
                ...prev,
                address: results[0]?.formatted_address || "",
            }));
            results[0]?.address_components.forEach((component) => {
                if (component.types.includes("locality")) {
                    setFormData((prev) => ({
                        ...prev,
                        city: component.long_name || "",
                    }));
                }
                if (component.types.includes("administrative_area_level_1")) {
                    setFormData((prev) => ({
                        ...prev,
                        state: component.long_name || "",
                    }));
                }
                if (component.types.includes("country")) {
                    setFormData((prev) => ({
                        ...prev,
                        country: component.long_name || "",
                    }));
                }
                if (component.types.includes("postal_code")) {
                    setFormData((prev) => ({
                        ...prev,
                        postal_code: component.long_name || "",
                    }));
                }
            });
            setValue(results[0]?.formatted_address || "");
        } catch (error) {
            console.error("Error fetching address from map click:", error);
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
                        setFormData((prev) => ({
                            ...prev,
                            latitude,
                            longitude,
                        }));
                        setFormData((prev) => ({
                            ...prev,
                            address: results[0]?.formatted_address || "",
                        }));
                        results[0]?.address_components.forEach((component) => {
                            if (component.types.includes("locality")) {
                                setFormData((prev) => ({
                                    ...prev,
                                    city: component.long_name || "",
                                }));
                            }
                            if (component.types.includes("administrative_area_level_1")) {
                                setFormData((prev) => ({
                                    ...prev,
                                    state: component.long_name || "",
                                }));
                            }
                            if (component.types.includes("country")) {
                                setFormData((prev) => ({
                                    ...prev,
                                    country: component.long_name || "",
                                }));
                            }
                            if (component.types.includes("postal_code")) {
                                setFormData((prev) => ({
                                    ...prev,
                                    postal_code: component.long_name || "",
                                }));
                            }
                        });
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

    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        category: "",
        room_name: "",
        room_type: "",
        room_for: "",
        description: "",
        rules: "",
        price_per_night: "",
        price_not_per_night: "",
        tax: "",
        capacity: "",
        no_of_room: "",
        latitude: "",
        longitude: "",
        address: "",
        address_line2: "",
        near_by: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        available_from: "",
        available_to: "",
        facilities: [],
        facilities: [],
        facilities: [],
        services: [],
        main_image: null,
        additional_images: [],
        status: "Available",
    });

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [position, setPosition] = useState([12.9716, 77.5946]); // Default position (e.g., Bangalore)
    const [facilitiesList, setFacilitiesList] = useState([]); // List of all facilities
    const [servicesList, setServicesList] = useState([]); // List of all services
    const [categoriesList, setCategoriesList] = useState([]); // List of all services
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchCategories();
        fetchFacilities();
        fetchServices();
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [currentPage, pageSize, searchQuery]); // Fetch data when page, page size, or search query changes

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        if (query === '') {
            setSearchQuery('');

        } else {

            setSearchQuery(query);
        }
        setIsSearching(true);

        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchRooms();
            setIsSearching(false);
        }, 500); // 500ms debounce delay

        return () => clearTimeout(debounceTimeout);
    };


    const fetchRooms = async () => {
        try {
            const response = await apiClient.get("/api/owner/rooms/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery, // Pass the search query to the backend
                },
            });
            console.log(response)
            setTotalCount(response.data.count);

            // Calculate total pages
            const newTotalPages = Math.ceil(response.data.count / pageSize);
            setTotalPages(newTotalPages);
            const sortedBookings = response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setRooms(sortedBookings);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get("/api/categories/list/");
            setCategoriesList(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchFacilities = async () => {
        try {
            const response = await apiClient.get("/api/facilities/list/");
            console.log(response)
            setFacilitiesList(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await apiClient.get("/api/owner/services/?no_pagination=true");
            setServicesList(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "additional_images") {
            setFormData({ ...formData, [name]: [...files] });

            const previews = [];
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    previews.push(reader.result);
                    if (previews.length === files.length) {
                        setAdditionalImagesPreview(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setFormData({ ...formData, [name]: files[0] });
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLocationChange = (lat, lng) => {
        setFormData({ ...formData, latitude: lat, longitude: lng });
        setPosition([lat, lng]);
    };
    const handleFacilityChange = (updatedFacilities) => {
        setSelectedFacilities(updatedFacilities); // Update local state
        setFormData({ ...formData, facilities: updatedFacilities });
    };

    const handleServiceChange = (updatedServices) => {
        setSelectedServices(updatedServices); // Update local state
        setFormData({ ...formData, services: updatedServices }); // Update formData
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => data.append(key, item));
            } else {
                data.append(key, formData[key]);
            }
        }
        console.log(formData, data)
        try {
            if (editMode) {
                await apiClient.put(`/api/owner/rooms/${editId}/`, data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
            } else {
                await apiClient.post("/api/owner/rooms/", data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
            }
            setFormData({
                category: "",
                room_name: "",
                room_type: "",
                room_for: "",
                description: "",
                rules: "",
                price_per_night: "",
                price_not_per_night: "",
                tax: "",
                capacity: "",
                no_of_room: "",
                latitude: "",
                longitude: "",
                address: "",
                address_line2: "",
                near_by: "",
                city: "",
                state: "",
                country: "",
                postal_code: "",
                available_from: "",
                available_to: "",
                facilities: [],
                services: [],
                main_image: null,
                additional_images: [],
                status: "Available",
            });
            setEditMode(false);
            setEditId(null);
            setIsModalOpen(false);
            fetchRooms();
        } catch (error) {
            console.error("Error saving room:", error);
        }
    };

    const handleEdit = (room) => {
        const updatedFormData = {
            ...room,
            available_from: room.available_from.split("T")[0],
            available_to: room.available_to?.split("T")[0],
            category: room.category.id, // Set category ID
            facilities: room.facilities.map((facility) => facility.id), // Set facilities IDs
            services: room.services.map((service) => service.id), // Set services IDs
        };

        // Update formData state
        setFormData(updatedFormData);
        setMainImagePreview(`${baseURL}${room.main_image}`); // Assuming `room.main_image` is a URL
        const additionalImageURLs = room.additional_images.map(image => `${baseURL}${image.image}`);
        console.log(additionalImageURLs);

        console.log(additionalImageURLs, additionalImagesPreview);
        setAdditionalImagesPreview(additionalImageURLs);

        // Update selected facilities and services
        setSelectedFacilities(updatedFormData.facilities);
        setSelectedServices(updatedFormData.services);

        setValue(room.address);
        setEditMode(true);
        setEditId(room.id);
        setIsModalOpen(true);
        setPosition([room.latitude, room.longitude]);
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/owner/rooms/${id}/`);
            fetchRooms();
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    const openModal = () => {
        setFormData({
            category: "",
            room_name: "",
            room_type: "",
            room_for: "",
            description: "",
            rules: "",
            price_per_night: "",
            price_not_per_night: "",
            tax: "",
            capacity: "",
            no_of_room: "",
            latitude: "",
            longitude: "",
            address: "",
            address_line2: "",
            near_by: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
            available_from: "",
            available_to: "",
            facilities: [],
            services: [],
            main_image: null,
            additional_images: [],
            status: "Available",
        });
        setMainImagePreview(null);
        setAdditionalImagesPreview([]);
        setEditMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-2">

                {/* Rooms Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Rooms"
                        headers={[
                            "ID",
                            "Room Name",
                            "Description",
                            "Price/Night",
                            "Category",
                            "Capacity",
                            "Status",
                            "Actions",
                        ]}
                        data={rooms.map((room) => [
                            room.id,
                            room.room_name,
                            room.description,
                            `₹${room.price_per_night}`,
                            room.category.name,
                            room.capacity,
                            <div
                                key={room.id}
                                className={`p-1 text-black rounded-lg ${room.status === 'Booked' ? 'bg-red-300' : 'bg-green-300'}`}
                            >
                                {room.status}
                            </div>,
                            <div key={room.id} className="space-x-2">
                                <Link key={room.id} href={`/room/${room.id}`}>
                                    <button
                                        className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                        style={{ backgroundColor: "blue" }}
                                    >
                                        View
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleEdit(room)}
                                    className="ml-2 px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                    style={{ backgroundColor: "blue" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="ml-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>,
                        ])}
                        actionButton={
                            <button
                                onClick={openModal}
                                style={{
                                    backgroundColor: "#10B981", // Green-500
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    fontWeight: "600",
                                    fontSize: "0.875rem",
                                    transition: "background-color 0.3s, transform 0.2s",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")} // Green-600
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10B981")} // Green-500
                            >
                                Add Room
                            </button>
                        }
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                </div>

                {/* Modal */}
                <ReusableModal
                    title={editMode ? "Update Room Details" : "Add New Room"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={editMode ? "Update Room" : "Add Room"}
                >
                    <div className="space-y-4" >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category : </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select a Category --</option>
                                {categoriesList.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room For : </label>

                            <select
                                id="room_for"
                                name="room_for"
                                value={formData.room_for}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Room For --</option>
                                <option value="Students">Students</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>

                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type : </label>

                            <select
                                id="room_type"
                                name="room_type"
                                value={formData.room_type}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Room Type --</option>
                                <option value="1BHK">1BHK</option>
                                <option value="2BHK">2BHK</option>
                                <option value="3BHK">3BHK</option>
                                <option value="4BHK">4BHK</option>
                                <option value="5BHK">5BHK</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name : </label>
                            <input
                                type="text"
                                name="room_name"
                                value={formData.room_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description : </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rules <small>(for new line use - in starting of line)</small> : </label>
                            <textarea
                                name="rules"
                                value={formData.rules}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night : </label>
                            <input
                                type="number"
                                name="price_per_night"
                                min="100"
                                value={formData.price_per_night}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Not /Night : </label>
                            <input
                                type="number"
                                name="price_not_per_night"
                                min="100"
                                value={formData.price_not_per_night}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax <small>(in Percentage)</small> : </label>
                            <input
                                type="number"
                                name="tax"
                                min="0"
                                max="100"
                                value={formData.tax}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity of Romm : </label>
                            <input
                                type="number"
                                name="capacity"
                                min="1"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                            <input
                                type="number"
                                name="no_of_room"
                                min="1"
                                value={formData.no_of_room}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="m-4 max-w-lg mx-auto container">
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
                                        className="border border-gray-300 rounded-lg p-3 pl-5 pr-25  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"

                                    />

                                    {/* Current Location Icon */}
                                    <a
                                        onClick={handleCurrentLocation}
                                        className="absolute transform text-blue-500 hover:text-blue-700 transition duration-200 cursor-pointer"
                                        style={{ marginLeft: "-30px", marginTop: "15px", outline: "none" }}
                                    >
                                        <FaLocationArrow size={20} />
                                    </a>


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

                                {/* Map */}
                                <div style={{ height: "400px", width: "100%" }} className="mt-4">
                                    <GoogleMap
                                        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "12px" }}
                                        zoom={15}
                                        center={selectedLocation || currentLocation || { lat: 37.7749, lng: -122.4194 }}
                                        onClick={handleMapClick}
                                    >
                                        {selectedLocation && <Marker position={selectedLocation} />}
                                        {currentLocation && !selectedLocation && <Marker position={currentLocation} />}
                                    </GoogleMap>
                                </div>
                            </LoadScriptNext>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address : </label>
                            <input
                                type="text"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Near By Address : </label>
                            <input
                                type="text"
                                name="near_by"
                                value={formData.near_by}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City : </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State : </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country : </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code : </label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Available From : </label>
                            <input
                                type="date"
                                name="available_from"
                                value={formData.available_from}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image : </label>
                            <input
                                type="file" accept="image/*"
                                name="main_image"
                                onChange={handleFileChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                            {mainImagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={mainImagePreview}
                                        alt="Main Preview"
                                        className="w-32 h-32 object-cover rounded-md border"
                                        style={{ width: "125px" }}

                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images <small>(you can select multiple images)</small>: </label>
                            <input
                                type="file" accept="image/*"
                                name="additional_images"
                                multiple
                                onChange={handleFileChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"

                            />
                            {additionalImagesPreview.length > 0 && (
                                <div className="mt-2 flex flex-wrap">
                                    {additionalImagesPreview.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Additional Preview ${index + 1}`}
                                            className="w-14 h-14 object-cover rounded-md border m-2 shadow"
                                            style={{ width: "125px" }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Facilities Dropdown */}
                        <MultiSelectDropdownWithSearch
                            label="Facilities"
                            placeholder="Search Facilities"
                            options={facilitiesList}
                            selectedItems={selectedFacilities}
                            onSelectionChange={handleFacilityChange}
                        />

                        <MultiSelectDropdownWithSearch
                            label="Services"
                            placeholder="Search Services"
                            options={servicesList}
                            selectedItems={selectedServices}
                            onSelectionChange={handleServiceChange}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status : </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Available">Available</option>
                                <option value="Booked">Booked</option>

                            </select>
                        </div>

                    </div>
                </ReusableModal>
            </div>
        </div>
    );
}

Room.layout = Owner;