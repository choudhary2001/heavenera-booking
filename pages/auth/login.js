import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
import { sendOtp, verifyOtp, clearMessage, LOGIN_SUCCESS, VERIFY_OTP_SUCCESS } from '../../actions/authActions';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import baseURL from './../../url';
import Auth from "layouts/Auth.js";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  console.log(authState)

  const { redirect } = router.query;
  console.log(redirect);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    setLoading(true);
    if (!otpSent) {
      dispatch(sendOtp(formData.email, formData.password))
        .finally(() => {
          setLoading(false)
        }
        );
    } else {
      try {
        dispatch(verifyOtp(formData.email, formData.password, formData.otp));

        // On successful OTP verification, redirect to the original page or default page
        // router.push(redirect || '/');
        if (redirect) {
          window.location.href = `${redirect}`;
        }
      } catch (error) {
        console.error('OTP verification failed:', error);
        // Handle error (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push('/');
    }

    if (authState.message) {
      setMessage(authState.message);
    }
    if (authState.error) {
      setMessage(authState.error);
    }

    if (authState.otpSent) {
      setOtpSent(authState.otpSent);
    }

    return () => {
      dispatch(clearMessage());
    };
  }, [authState.isAuthenticated, authState.message, authState.otpSent, dispatch, router]);

  const [message, setMessage] = useState("");

  const handleLoginSuccess = async (response) => {
    try {
      const { credential } = response;

      const res = await axios.post(`${baseURL}/api/auth/google/login/`, {
        id_token: credential,
      });
      console.log(res)

      const data = res.data;

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      }));

      const user = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      };

      dispatch({
        type: VERIFY_OTP_SUCCESS,
        payload: { accessToken: data.access, refreshToken: data.refresh, user: user },
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { accessToken: data.access, refreshToken: data.refresh, user: user, role: data.role, },
      });

      // router.push(redirect || "/");
      if (redirect) {
        window.location.href = `${redirect}`;
      }

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
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              {!otpSent ? (
                <>
                  <div className="rounded-t mb-0 px-6 py-6 px-4 lg:px-10 py-10 ">
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
                  <small>Or sign in with credentials</small>
                </div> */}
                <form>
                  {!otpSent ? (
                    <>
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
                          placeholder="Enter Your Email"
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
                            Remember me
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className=" py-6">
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
                          {otpSent ? "Verifying OTP..." : "Sending OTP..."}
                        </div>
                      ) : otpSent ? (
                        "Verify OTP"
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="/auth/forget-password"
                  className="text-blueGray-200"
                >
                  <small>Forgot password?</small>
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

Login.layout = Auth;
