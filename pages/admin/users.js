import React, { useState, useEffect, useCallback } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import ReusableModal from "components/Modal/ReusableModal";
import baseURL from "../../url";

export default function Users() {
    const [roomOwners, setRoomOwners] = useState([]);
    const [formData, setFormData] = useState({
        owner: "",
        phone: "",
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        profile_image: null,
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        branch_name: "",
        id_proof_type: "",
        id_proof_number: "",
        id_proof_image: null,
        emergency_contact: "",
        notes: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewIdProofImage, setPreviewIdProofImage] = useState(null);

    // Fetch Userss from the API
    const fetchRoomOwners = useCallback(async () => {
        try {
            const response = await apiClient.get(`${baseURL}/api/admin/users/`, {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery,
                },
            });
            setRoomOwners(response.data.results);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error("Error fetching Userss:", error);
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchRoomOwners();
    }, [fetchRoomOwners]);

    // Handle pagination changes
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle page size changes
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Handle search input changes with debounce
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);

        const debounceTimeout = setTimeout(() => {
            setCurrentPage(1);
            fetchRoomOwners();
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
            if (name === "profile_image") {
                setPreviewImage(URL.createObjectURL(files[0]));
            } else if (name === "id_proof_image") {
                setPreviewIdProofImage(URL.createObjectURL(files[0]));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle editing a Users
    const handleEdit = (roomOwner) => {
        setFormData(roomOwner);
        setEditMode(true);
        setEditId(roomOwner.id);
        setPreviewImage(roomOwner.profile_image ? `${baseURL}${roomOwner.profile_image}` : null);
        setPreviewIdProofImage(roomOwner.id_proof_image ? `${baseURL}${roomOwner.id_proof_image}` : null);
        setIsModalOpen(true);
    };

    // Handle deleting a Users
    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`${baseURL}/api/admin/users/${id}/`);
            fetchRoomOwners();
        } catch (error) {
            console.error("Error deleting Users:", error);
        }
    };

    // Open the modal for adding a new Users
    const openModal = () => {
        setFormData({
            owner: "",
            phone: "",
            first_name: "",
            last_name: "",
            email: "",
            date_of_birth: "",
            profile_image: null,
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
            bank_name: "",
            account_holder_name: "",
            account_number: "",
            ifsc_code: "",
            branch_name: "",
            id_proof_type: "",
            id_proof_number: "",
            id_proof_image: null,
            emergency_contact: "",
            notes: "",
        });
        setPreviewImage(null);
        setPreviewIdProofImage(null);
        setEditMode(false);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewImage(null);
        setPreviewIdProofImage(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null && formData[key] !== "") {
                    formDataToSend.append(key, formData[key]);
                }
            }

            if (editMode) {
                await apiClient.put(`${baseURL}/api/admin/users/${editId}/`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                await apiClient.post(`${baseURL}/api/admin/users/`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            fetchRoomOwners();
            closeModal();
        } catch (error) {
            console.error("Error saving Users:", error);
        }
    };

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <div className="mt-8">
                    <CardTable
                        color="light"
                        title="Users"
                        headers={["ID", "Phone", "First Name", "Last Name", "Email", "Profile Image", "Actions"]}
                        data={roomOwners.map((roomOwner) => [
                            roomOwner.id,
                            roomOwner.phone,
                            roomOwner.first_name,
                            roomOwner.last_name,
                            roomOwner.email,
                            roomOwner.profile_image ? (
                                <img
                                    src={`${baseURL}${roomOwner.profile_image}`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                "No Image"
                            ),
                            <div key={roomOwner.id} className="space-x-2">
                                <button
                                    onClick={() => handleEdit(roomOwner)}
                                    className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(roomOwner.id)}
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
                                Add Users
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

                {/* Modal for adding/editing Userss */}
                <ReusableModal
                    title={editMode ? "Edit Users" : "Add New Users"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={editMode ? "Update Users" : "Add Users"}
                    size="lg" // Make the modal larger to fit all fields
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                            <input
                                type="file"
                                name="profile_image"
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="mt-2 w-20 h-20 rounded-full"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                            <input
                                type="text"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                            <input
                                type="text"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                            <input
                                type="text"
                                name="account_holder_name"
                                value={formData.account_holder_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <input
                                type="text"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                            <input
                                type="text"
                                name="ifsc_code"
                                value={formData.ifsc_code}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                            <input
                                type="text"
                                name="branch_name"
                                value={formData.branch_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
                            <select
                                name="id_proof_type"
                                value={formData.id_proof_type}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select ID Proof Type</option>
                                <option value="Aadhaar">Aadhaar</option>
                                <option value="PAN">PAN</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Number</label>
                            <input
                                type="text"
                                name="id_proof_number"
                                value={formData.id_proof_number}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Image</label>
                            <input
                                type="file"
                                name="id_proof_image"
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                            {previewIdProofImage && (
                                <img
                                    src={previewIdProofImage}
                                    alt="ID Proof Preview"
                                    className="mt-2 w-20 h-20 rounded-full"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                            <input
                                type="text"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </ReusableModal>
            </div>
        </div>
    );
}

Users.layout = Admin;