// SignUp.tsx
import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
// layout for page
import baseURL from '../../url';

import axios from 'axios';
import Auth from "layouts/Auth.js";

export default function RoomOwnerStepperForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        owner: null,
        phone: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Reset previous messages

        if (!otpSent) {
            await handleFormSubmit();
        } else {
            await verifyOtp();
        }
    };

    // Function to verify OTP
    const verifyOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/api/auth/verify-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Account created successfully!");
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1000);

                // Optionally, redirect the user or reset the form here
            } else {
                setMessage(data.detail || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage("An error occurred while verifying OTP. Please try again later.");
        } finally {
            setLoading(false);
        }
    };



    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleFormSubmit = async () => {

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.post(`${baseURL}/api/auth/owner/signup/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {

                setOtpSent(true);
                setMessage("OTP has been sent to your email. Please check your inbox.");

            }
            else {
                setMessage(response.detail || "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error creating Room Owner:", error);
            setMessage("An error occurred while sending OTP. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
        <div className="container relative mx-auto px-4 h-full">
            <div className="flex flex-col content-center items-center justify-center h-full">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0 p-6">
                        {otpSent ? (
                            <>
                                <div className="relative w-full mb-3 py-6">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password"
                                    >
                                        Otp
                                    </label>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        disabled={loading}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="123456"
                                        value={formData.otp}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        ) : (<>

                            {renderStep()}
                        </>)}
                        <div className="flex justify-between mt-6">
                            {otpSent ? (
                                step > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Previous
                                    </button>
                                )
                            ) : (<>
                                {null}
                            </>)}
                            {step < 5 ? (
                                <button
                                    onClick={nextStep}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    {loading ? (
                                        <>
                                            <div className="flex items-center justify-center">

                                                <svg
                                                    className="w-5 h-5 mr-3 text-white animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    ></path>
                                                </svg>
                                                {otpSent ? "Verifying OTP..." : "Sending OTP..."}
                                            </div>

                                        </>
                                    ) : otpSent ? (
                                        "Verify OTP"
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap mt-6 relative">
                    <div className="">
                        <Link href="/auth/login">
                            <p className="text-blueGray-200">
                                If You have already an account then Login
                            </p>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

RoomOwnerStepperForm.layout = Auth;