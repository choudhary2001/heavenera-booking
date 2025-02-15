import React, { useState, useEffect, useRef } from 'react';

const MultiSelectDropdownWithSearch = ({
    label = 'Select Items',       // Label for the dropdown
    placeholder = 'Search...',    // Placeholder text for input
    options = [],                 // List of options { id, name }
    selectedItems = [],           // Selected items array
    onSelectionChange = () => { }, // Callback for selection changes
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false); // Track input focus
    const dropdownRef = useRef(null); // Reference for the dropdown
    const inputRef = useRef(null); // Reference for the input

    // Filter options based on the search term
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckboxChange = (itemId) => {
        const updatedSelection = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId];

        onSelectionChange(updatedSelection);
    };

    const handleRemoveItem = (itemId) => {
        const updatedSelection = selectedItems.filter(id => id !== itemId);
        onSelectionChange(updatedSelection);
    };

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setIsFocused(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label} :</label>
            <div className="relative">
                {/* Input box showing selected items */}
                <div
                    ref={inputRef}
                    className="w-full flex flex-wrap items-center gap-2 rounded-lg border border-gray-300  focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
                    onClick={() => setIsFocused(true)}
                >
                    {selectedItems.map((itemId) => {
                        const item = options.find(option => option.id === itemId);
                        return (
                            <div
                                key={itemId}
                                className="flex items-center bg-indigo-100 text-sm rounded-md px-2 py-1 border m-1"
                            >
                                {item?.name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveItem(itemId);
                                    }}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </div>
                        );
                    })}
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)} // Handle focus
                        className="flex-1 min-w-[100px] focus:outline-none border-none outline-none"
                    />
                </div>

                {/* Show dropdown menu when input is focused or search term is not empty */}
                {(isFocused || searchTerm) && (
                    <div
                        ref={dropdownRef}
                        className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg absolute w-full mt-2 bg-white shadow-lg z-50"
                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur on click
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div key={option.id} className="flex items-center px-4 py-2 hover:bg-indigo-100">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(option.id)}
                                        onChange={() => handleCheckboxChange(option.id)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-700">{option.name}</label>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No {`${placeholder}`} found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelectDropdownWithSearch;
