import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Owner from "layouts/Owner.js";
import ReusableModal from "components/Modal/ReusableModal";
import Swal from "sweetalert2";
import clsx from 'clsx';

export default function Services() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", price: "" });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isSearching, setIsSearching] = useState(false); // State to track search loading

    useEffect(() => {
        fetchServices();
    }, [currentPage, pageSize, searchQuery]);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get("/api/owner/services/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery, // Pass the search query to the backend
                },
            });
            setServices(response.data.results);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

        // Debounce the search to avoid too many API calls
        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
            fetchServices();
            setIsSearching(false);
        }, 500); // 500ms debounce delay

        return () => clearTimeout(debounceTimeout);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await apiClient.put(`/api/owner/owner/services/${editId}/`, formData);
            } else {
                await apiClient.post("/api/services/", formData);
            }
            setFormData({ name: "", description: "", price: "" });
            setEditMode(false);
            setEditId(null);
            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    const handleEdit = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
        });
        setEditMode(true);
        setEditId(service.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/ownerservices/${id}/`);
            fetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const openModal = () => {
        setFormData({ name: "", description: "", price: "" });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-2">
                {/* Services Table */}
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Services"
                        headers={["ID", "Name", "Description", "Price", "Actions"]}
                        data={services.map((service) => [
                            service.id,
                            service.name,
                            service.description,
                            `₹${service.price}`,
                            <div key={service.id} className="space-x-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                    style={{ backgroundColor: "blue" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
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
                                Add Service
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
                    title={editMode ? "Edit Service" : "Add New Service"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={editMode ? "Update Service" : "Add Service"}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name : </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full mb-2 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description : </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price : </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </ReusableModal>
            </div>
        </div>
    );
}

Services.layout = Owner;
