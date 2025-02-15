import React, { useState, useEffect, useCallback } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import ReusableModal from "components/Modal/ReusableModal";
import * as FaIcons from "react-icons/fa"; // Import all Font Awesome icons
import * as TbIcons from "react-icons/tb"; // Import all Tailwind Icons

export default function Facility() {
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Combine all icons from React Icons and Tailwind Icons
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

    const fetchFacilities = useCallback(async () => {
        try {
            const response = await apiClient.get("/api/admin/facilities/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            setFacilities(response.data.results); // Assuming the API returns results and count
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error("Error fetching facilities:", error);
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1);
            fetchFacilities();
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleIconChange = (icon) => {
        setFormData({ ...formData, icon: icon.name });
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await apiClient.put(`/api/admin/facilities/${editId}/`, formData);
            } else {
                await apiClient.post("/api/admin/facilities/", formData);
            }
            setFormData({ name: "", description: "", icon: "" });
            setEditMode(false);
            setEditId(null);
            setIsModalOpen(false);
            fetchFacilities();
        } catch (error) {
            console.error("Error saving facility:", error);
        }
    };

    const handleEdit = (facility) => {
        setFormData({
            name: facility.name,
            description: facility.description,
            icon: facility.main_image,
        });
        setEditMode(true);
        setEditId(facility.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/admin/facilities/${id}/`);
            fetchFacilities();
        } catch (error) {
            console.error("Error deleting facility:", error);
        }
    };

    const openModal = () => {
        setFormData({ name: "", description: "", icon: "" });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const filteredIcons = allIcons.filter((icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isDropdownOpen && !e.target.closest(".icon-dropdown")) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">


                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Facilities"
                        headers={["ID", "Name", "Description", "Icon", "Actions"]}
                        data={facilities.map((facility) => [
                            facility.id,
                            facility.name,
                            facility.description,
                            <div key={facility.id} className="flex items-center">
                                {allIcons.find((icon) => icon.name === facility.icon)?.reactIcon || "No Icon"}
                            </div>,
                            <div key={facility.id} className="space-x-2">
                                <button
                                    onClick={() => handleEdit(facility)}
                                    className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(facility.id)}
                                    className="ml-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>,
                        ])}
                        actionButton={
                            <button
                                onClick={openModal}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Add Facility
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

                <ReusableModal
                    title={editMode ? "Edit Facility" : "Add New Facility"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={editMode ? "Update Facility" : "Add Facility"}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <div className="relative icon-dropdown">
                            <div
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 flex items-center justify-between cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>
                                    {formData.icon
                                        ? allIcons.find((icon) => icon.name === formData.icon)?.reactIcon
                                        : "Select Icon"}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-auto bg-white rounded-lg shadow-lg border border-gray-300 max-h-60 overflow-y-auto" style={{ height: "250px" }}>
                                    <div className="p-2">
                                        <div className="flex items-center border border-gray-300 rounded-lg px-2">
                                            <FaIcons.FaSearch className="text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search icons..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full p-2 outline-none border-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 p-2">
                                        {filteredIcons.map((icon, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleIconChange(icon)}
                                                className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer ${formData.icon === icon.name
                                                    ? "border-indigo-500 bg-indigo-50"
                                                    : "border-gray-300 hover:border-indigo-500"
                                                    }`}
                                            >
                                                <span className="text-xl">{icon.reactIcon}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ReusableModal>
            </div>
        </div>
    );
}

Facility.layout = Admin;