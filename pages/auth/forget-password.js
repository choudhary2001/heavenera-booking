import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
import { sendOtp, verifyOtp, clearMessage, LOGIN_SUCCESS, VERIFY_OTP_SUCCESS } from '../../actions/authActions';
import axios from 'axios';
import baseURL from './../../url';
import Auth from "layouts/Auth.js";

export default function ForgetPassword() {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password1: "",
        otp: null,
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [accessToken, setAccessToken] = useState("");

    const [passwordsMatch, setPasswordsMatch] = useState(true); // Track if passwords match

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === "password" || e.target.name === "password1") {
            setPasswordsMatch(formData.password === e.target.value || formData.password1 === e.target.value);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!otpSent && !otpVerified) {
            // Send OTP
            try {
                const response = await axios.post(`${baseURL}/auth/api/forget-password/`, {
                    email: formData.email,
                });
                if (response.status === 200) {
                    setOtpSent(true);
                    setMessage('OTP Sent to your email.');
                }
            } catch (error) {
                setMessage('Failed to send OTP. Please try again.');
            } finally {
                setLoading(false);
            }
        } else if (otpSent && !otpVerified) {
            // Verify OTP
            try {
                const response = await axios.post(`${baseURL}/auth/api/forget-password/`, {
                    email: formData.email,
                    otp: formData.otp,
                });
                if (response.status === 200) {
                    const { access } = response.data;
                    setAccessToken(access);
                    setOtpVerified(true);
                    setMessage('OTP verified successfully.');
                }
            } catch (error) {
                setMessage('OTP verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else if (otpVerified) {
            // Change password
            if (!passwordsMatch) {
                setMessage('Passwords do not match.');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.post(
                    `${baseURL}/auth/api/change-password/`,
                    {
                        email: formData.email,
                        password: formData.password,
                        password1: formData.password1,
                        otp: formData.otp,

                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setMessage('Your Password Changed Successfully.');
                    setOtpVerified(false);
                    setOtpSent(false);
                    setFormData({
                        email: "",
                        password: "",
                        password1: "",
                        otp: "",
                    });
                }
            } catch (error) {
                setMessage('Password change failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };


    const RefreshPage = () => {
        setOtpSent(false);
        dispatch({
            type: "LOGOUT",
            payload: { accessToken: null, refreshToken: null, user: null, role: null, isAuthenticated: null, loading: null, message: '', otpSent: null },

        });
    }
    return (
        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">


                            <div className="flex-auto px-4 lg:px-10 py-10">
                                <div className="text-blueGray-400 text-center mb-3 font-bold">
                                    <h2>Forget Password</h2>
                                </div>
                                <form>
                                    {!otpSent ? (
                                        <>
                                            <div>

                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    disabled={loading}
                                                    className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Enter Your Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                        </>
                                    ) : (
                                        <div>
                                            {otpSent && otpVerified ? (
                                                <div>

                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        required
                                                        disabled={loading}
                                                        className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Enter Password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <input
                                                        id="password1"
                                                        name="password1"
                                                        type="password1"
                                                        required
                                                        disabled={loading}
                                                        className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Enter Password"
                                                        value={formData.password1}
                                                        onChange={handleChange}
                                                    />
                                                    {!passwordsMatch && (
                                                        <p className="text-red-500 mt-2">Passwords do not match</p>
                                                    )}
                                                </div>
                                            )
                                                :
                                                (
                                                    <input
                                                        id="otp"
                                                        name="otp"
                                                        type="text"
                                                        required
                                                        disabled={loading}
                                                        className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Enter OTP"
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                    />
                                                )

                                            }

                                        </div>
                                    )}

                                    {message && (
                                        <p
                                            className={`mt-4 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}
                                        >
                                            {message}
                                        </p>
                                    )}


                                    <div className="text-center mt-6">
                                        <button onClick={handleSubmit}
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            {loading ? (
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
                                                    {otpSent ? (otpVerified ? "Updating Password..." : "Verifying OTP...") : "Sending OTP..."}
                                                </div>
                                            ) : otpSent ? (
                                                otpVerified ? "Change Password" : "Verify OTP"
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-6 relative">
                            <div className="w-1/2">
                                <a
                                    href="/auth/login"
                                    className="text-blueGray-200"
                                >
                                    <small>Login</small>
                                </a>
                            </div>
                            <div className="w-1/2 text-right">
                                <Link href="/auth/register">
                                    <p className="text-blueGray-200">
                                        <small>Create new account</small>
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ForgetPassword.layout = Auth;
