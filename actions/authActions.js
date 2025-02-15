import axios from 'axios';
import baseURL from '../url';

export const SEND_OTP_SUCCESS = 'SEND_OTP_SUCCESS';
export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const SET_LOADING = 'SET_LOADING';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const SET_LOCATION = 'SET_LOCATION';

export const sendOtp = (email, password) => async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
        const response = await axios.post(`${baseURL}/api/auth/signin/`, { email, password });
        if (response.status === 200) {
            dispatch({
                type: SEND_OTP_SUCCESS,
                payload: { message: 'OTP sent to your email', email, password },
            });
        }
    } catch (error) {
        dispatch({
            type: AUTH_FAIL,
            payload: error.response?.data?.detail || 'Failed to send OTP. Please try again.',
        });
    }
};

export const verifyOtp = (email, password, otp) => async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
        const response = await axios.post(`${baseURL}/api/auth/signin/`, { email, password, otp });
        const data = response.data;

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
        dispatch({
            type: AUTH_FAIL,
            payload: error.response?.data?.detail || 'Invalid OTP. Please try again.',
        });
    }
};

// Pass dispatch to the logout function
export const logout = (refreshToken, accessToken) => async (dispatch) => {

    dispatch({ type: SET_LOADING });

    try {
        const response = await axios.post(`${baseURL}/api/auth/sign-out/`, {
            refresh_token: refreshToken
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Include access token here
            }
        });

        // Successfully logged out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('maintenanceAccess');
        localStorage.removeItem('refreshToken');
        localStorage.clear();
        sessionStorage.clear();
        dispatch({
            type: LOGOUT,
            payload: { accessToken: null, refreshToken: null, user: null, role: null },
        });
        window.location.href = '/auth/login';

    } catch (error) {
        console.error('Error logging out:', error);
        // Successfully logged out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('maintenanceAccess');

        localStorage.clear();
        sessionStorage.clear();
        dispatch({
            type: LOGOUT,
            payload: { accessToken: null, refreshToken: null, user: null, role: null },
        });

    }
    finally {
        window.location.reload();
    }
};


export const refreshAccessToken = (refreshToken, accessToken) => async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
        const response = await axios.post(`${baseURL}/api/auth/token/refresh/`, { refreshToken });
        console.log(response);
        if (response.status === 200) {

            const data = response.data;

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
                type: LOGIN_SUCCESS,
                payload: { accessToken: data.access, refreshToken: data.refresh },
            });
        }
        else {
            dispatch(logout(refreshToken, accessToken)); // Redirect to login if refresh token is invalid
            localStorage.clear()
            sessionStorage.clear()
        }
    } catch (error) {
        console.error('Failed to refresh token:', error);
        dispatch(logout(refreshToken, accessToken)); // Redirect to login if refresh token is invalid
        localStorage.clear()
        sessionStorage.clear()
    }
};


export const clearMessage = () => ({ type: CLEAR_MESSAGE });
