import React, { useState, useEffect, useCallback } from "react";
import apiClient from '../../actions/axiosInterceptor';
import CardTable from "components/Cards/CardTable.js";
import Admin from "layouts/Admin.js";
import ReusableModal from "components/Modal/ReusableModal";

export default function Commision() {
    const [commision, setCommision] = useState(null); // Only one commision instance
    const [formData, setFormData] = useState({ percentage: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch the single commision instance
    const fetchCommision = useCallback(async () => {
        try {
            const response = await apiClient.get("/api/admin/commision/");
            if (response.data) {
                setCommision(response.data);
            }
        } catch (error) {
            console.error("Error fetching commision:", error);
            // Add user-friendly error handling here (e.g., toast notification)
        }
    }, []);

    useEffect(() => {
        fetchCommision();
    }, [fetchCommision]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (commision) {
                // Update existing commision
                await apiClient.put(`/api/admin/commision/`, formData);
            } else {
                // Create new commision
                await apiClient.post("/api/admin/commision/", formData);
            }
            setFormData({ percentage: 0 }); // Reset form data
            setIsModalOpen(false);
            fetchCommision(); // Refresh the data
        } catch (error) {
            console.error("Error saving commision:", error);
            // Add user-friendly error handling here (e.g., toast notification)
        }
    };

    // Open the modal for editing commision
    const openModal = () => {
        if (commision) {
            setFormData({ percentage: commision.percentage });
        } else {
            setFormData({ percentage: 0 });
        }
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
                        title="Commision"
                        headers={["ID", "Percentage", "Actions"]}
                        data={commision ? [
                            [
                                commision.id,
                                `${commision.percentage}%`,
                                <div key={commision.id} className="space-x-2">
                                    <button
                                        onClick={openModal}
                                        className="px-4 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                    >
                                        Edit
                                    </button>
                                </div>,
                            ],
                        ] : []}
                        actionButton={
                            <button
                                onClick={openModal}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                            >
                                {commision ? "Edit Commision" : "Add Commision"}
                            </button>
                        }
                    />
                </div>

                {/* Modal for adding/editing commision */}
                <ReusableModal
                    title={commision ? "Edit Commision" : "Add Commision"}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    submitText={commision ? "Update Commision" : "Add Commision"}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            name="percentage"
                            value={formData.percentage}
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

Commision.layout = Admin;