import axios from 'axios';
import { refreshAccessToken } from './authActions';
import baseURL from './../url';

// Utility to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return false; // Handle the case where token is not provided
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        return false; // Treat as expired if there's an error
    }
};

// Create an Axios instance
const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
apiClient.interceptors.request.use(async (config) => {
    try {
        let accessToken = localStorage.getItem('accessToken'); // Get the access token from localStorage
        const refreshToken = localStorage.getItem('refreshToken'); // Get refresh token from localStorage

        // Check if token is expired
        if (accessToken && isTokenExpired(accessToken)) {
            // If expired, refresh the token
            const newAccessToken = await refreshAccessToken(refreshToken);
            accessToken = newAccessToken; // Update accessToken
            localStorage.setItem('accessToken', newAccessToken); // Save new token
        }

        // Add Authorization header if accessToken is available
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    } catch (error) {
        console.error("Request Interceptor Error", error);
        localStorage.clear(); // Clear tokens and other storage items
        sessionStorage.clear();
        window.location.reload()
        return Promise.reject(error);
    }
}, (error) => {
    localStorage.clear(); // Clear tokens and other storage items
    sessionStorage.clear();
    window.location.reload()
    return Promise.reject(error);
});

// Response interceptor to handle token expiry and refresh
apiClient.interceptors.response.use(
    (response) => response, // Success response, pass through
    async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error (unauthorized) and retry is not already done
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken'); // Get refresh token from localStorage

            if (refreshToken) {
                try {
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    localStorage.setItem('accessToken', newAccessToken); // Save new access token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest); // Retry original request with new token
                } catch (err) {
                    console.error("Token refresh failed", err);
                    localStorage.clear(); // Clear tokens and other storage items
                    sessionStorage.clear();
                    window.location.reload();
                    return Promise.reject(error); // Redirect to login or handle logout
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
