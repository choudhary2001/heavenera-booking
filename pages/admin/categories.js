import React, { useState, useEffect, useCallback } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import ReusableModal from "components/Modal/ReusableModal";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Fetch categories from the API
    const fetchCategories = useCallback(async () => {
        try {
            const response = await apiClient.get("/api/admin/categories/", {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            setCategories(response.data.results); // Assuming the API returns results and count
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Add user-friendly error handling here (e.g., toast notification)
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle pagination changes
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle page size changes
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to the first page
    };

    // Handle search input changes with debounce
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1);
            fetchCategories();
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await apiClient.put(`/api/admin/categories/${editId}/`, formData);
            } else {
                await apiClient.post("/api/admin/categories/", formData);
            }
            setFormData({ name: "", description: "" }); // Reset form data
            setEditMode(false);
            setEditId(null);
            setIsModalOpen(false);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error("Error saving category:", error);
            // Add user-friendly error handling here (e.g., toast notification)
        }
    };

    // Handle editing a category
    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
        });
        setEditMode(true);
        setEditId(category.id);
        setIsModalOpen(true);
    };

    // Handle deleting a category
    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/admin/categories/${id}/`);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error("Error deleting category:", error);
            // Add user-friendly error handling here (e.g., toast notification)
        }
    };

    // Open the modal for adding a new category
    const openModal = () => {
        setFormData({ name: "", description: "" });
        setEditMode(false);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Categories"
                        headers={["ID", "Name", "Description", "Actions"]}
                        data={categories.map((category) => [
                            category.id,
                            category.name,
                            category.description,
                            <div key={category.id} className="space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
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
                                Add Category
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

                {/* Modal for adding/editing categories */}
                <ReusableModal
                    title={editMode ? "Edit Category" : "Add New Category"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={editMode ? "Update Category" : "Add Category"}
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
                </ReusableModal>
            </div>
        </div>
    );
}

Categories.layout = Admin;