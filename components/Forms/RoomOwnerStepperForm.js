import React, { useState } from "react";

export default function RoomOwnerStepperForm({ initialData, onSubmit, onCancel, editMode }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Personal Details</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="file"
                                name="profile_image"
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Address Details</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="address_line1"
                                placeholder="Address Line 1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="address_line2"
                                placeholder="Address Line 2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="postal_code"
                                placeholder="Postal Code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Bank Details</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="bank_name"
                                placeholder="Bank Name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="account_holder_name"
                                placeholder="Account Holder Name"
                                value={formData.account_holder_name}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="account_number"
                                placeholder="Account Number"
                                value={formData.account_number}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="ifsc_code"
                                placeholder="IFSC Code"
                                value={formData.ifsc_code}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="text"
                                name="branch_name"
                                placeholder="Branch Name"
                                value={formData.branch_name}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Identification Details</h2>
                        <div className="space-y-4">
                            <select
                                name="id_proof_type"
                                value={formData.id_proof_type}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            >
                                <option value="">Select ID Proof Type</option>
                                <option value="Aadhaar">Aadhaar</option>
                                <option value="PAN">PAN</option>
                                <option value="Passport">Passport</option>
                            </select>
                            <input
                                type="text"
                                name="id_proof_number"
                                placeholder="ID Proof Number"
                                value={formData.id_proof_number}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <input
                                type="file"
                                name="id_proof_image"
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Additional Details</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="emergency_contact"
                                placeholder="Emergency Contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            <textarea
                                name="notes"
                                placeholder="Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="border-0 px-3 py-3  text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between mt-6">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                )}
                {step < 5 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next
                    </button>
                ) : (
                    null
                )}
            </div>
        </form>
    );
}