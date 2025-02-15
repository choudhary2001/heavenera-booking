import React, { useState, useEffect } from "react";
import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { FaLocationArrow, FaSearch } from 'react-icons/fa'; // Import an icon for current location
import { SET_LOCATION } from '../../actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";

export default function Map() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [activeSuggestion, setActiveSuggestion] = useState(0); // Tracks keyboard selection
    const [searchType, setSearchType] = useState("Students");

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setCurrentLocation({
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude,
    //                 });
    //                 dispatch({
    //                     type: SET_LOCATION,
    //                     payload: { lat: position.coords.latitude, lng: position.coords.longitude },
    //                 });
    //             },
    //             (error) => console.error("Error getting location:", error)
    //         );
    //     }
    // }, []); // Empty dependency array ensures this runs once on mount

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
                        setValue(results[0]?.formatted_address || "");
                        // setSelectedLocation(null); // Clear the selected location on current location click
                    } catch (error) {
                        console.error("Error fetching address for current location:", error);
                    }
                },
                (error) => console.error("Error getting current location:", error)
            );
        }
    };

    const handleSearch = () => {
        // if (value) {
        console.log(value);
        handleSelect(value); // Trigger search manually based on input
        router.push(`/room?room_for=${searchType}`);
        // }
    };

    return (
        <div className="m-4  mx-auto container">
            <LoadScriptNext
                googleMapsApiKey="AIzaSyCLp0BWj-PHv0RtwuxrUxvItuDiVVsa-TY"
                libraries={['places']}
            >
                {/* Input Box with Location Icon */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-center font-bold pb-8">
                    Explore Hospitality & Accommodations
                </h2>

                <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full mb-4">
                    <button
                        className={`p-3 rounded-2xl w-full md:w-1/3 text-lg border-none outline-none font-semibold transition duration-300 ${searchType === 'Students' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-800 border-gray-300 hover:bg-red-100'} border-none outline-none`}
                        onClick={() => setSearchType('Students')}
                    >
                        For Students
                    </button>

                    <button
                        className={`p-3  rounded-2xl w-full md:w-1/3 text-lg font-semibold transition duration-300 ${searchType === 'Commercial' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-800 border-gray-300 hover:bg-red-100'} border-none outline-none`}
                        onClick={() => setSearchType('Commercial')}
                    >
                        Commercial
                    </button>

                    <button
                        className={`p-3  rounded-2xl w-full md:w-1/3 text-lg font-semibold transition duration-300 ${searchType === 'Residential' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-800 border-gray-300 hover:bg-red-100'} border-none outline-none`}
                        onClick={() => setSearchType('Residential')}
                    >
                        Residential
                    </button>
                </div>

                <div className="relative">
                    <input
                        value={value}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        disabled={!ready}
                        placeholder="Search a location"
                        className="border border-gray-300 rounded-lg p-3 pl-5 pr-25  focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-full md:w-4/5 lg:w-3/4"
                        style={{ width: "calc(100% - 68px)" }}
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
                        className="absolute transform  text-blue-500 hover:text-blue-700 transition duration-200 bg-white p-4 ml-2 rounded-lg"
                        style={{ outline: "none", width: "55px" }}
                    >
                        <FaSearch size={20} />
                    </button>
                </div>

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
    );
}
