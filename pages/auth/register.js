// SignUp.tsx
import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
// layout for page
import baseURL from '../../url';
import { sendOtp, clearMessage, LOGIN_SUCCESS, VERIFY_OTP_SUCCESS } from '../../actions/authActions';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Auth from "layouts/Auth.js";

export default function Register() {
  const dispatch = useDispatch();

  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset previous messages

    if (!otpSent) {
      await sendOtp();
    } else {
      await verifyOtp();
    }
  };

  // Function to send OTP
  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setMessage("OTP has been sent to your email. Please check your inbox.");
      } else {
        setMessage(data.detail || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("An error occurred while sending OTP. Please try again later.");
    } finally {
      setLoading(false);
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



  const handleLoginSuccess = async (response) => {
    try {
      const { credential } = response;

      // Send Google ID token to the backend for verification and login
      const res = await axios.post(`${baseURL}/api/auth/google/login/`, {
        id_token: credential,
      });
      console.log(res)

      const data = res.data;

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      }));

      const user = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role, // Ensure your API returns a user role
      };

      dispatch({
        type: VERIFY_OTP_SUCCESS,
        payload: { accessToken: data.access, refreshToken: data.refresh, user: user },
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { accessToken: data.access, refreshToken: data.refresh, user: user, role: data.role, },
      });

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLoginError = (error) => {
    console.error('Google login failed:', error);
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
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0 ">
              {!otpSent ? (
                <>
                  <div className="rounded-t mb-0 px-6 py-6 px-4 lg:px-10 py-10">
                    <div className="btn-wrapper text-center">

                      <div className="App">
                        <GoogleLogin
                          onSuccess={handleLoginSuccess}
                          onError={handleLoginError}
                          useOneTap
                        />
                      </div>
                    </div>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                  </div>
                </>
              ) : (
                null
              )
              }
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                {/* <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div> */}
                <form>
                  {!otpSent ? (
                    <>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          First Name
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          required
                          disabled={loading}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Enter Your First Name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Last Name
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          required
                          disabled={loading}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Last Name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          disabled={loading}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          disabled={loading}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            id="customCheckLogin"
                            type="checkbox"
                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          />
                          <span className="ml-2 text-sm font-semibold text-blueGray-600">
                            I agree with the{" "}
                            <a
                              href="#pablo"
                              className="text-lightBlue-500"
                              onClick={(e) => e.preventDefault()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
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

                  )}
                  {message && (
                    <p className={`mt-4 text-sm text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                      {message}
                    </p>
                  )}

                  <div className="text-center mt-6">
                    <button onClick={handleSubmit}
                      disabled={loading}
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
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
                  </div>
                </form>
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
      </div>
    </>
  );
}

Register.layout = Auth;
