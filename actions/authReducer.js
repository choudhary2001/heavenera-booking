import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SEND_OTP_SUCCESS, VERIFY_OTP_SUCCESS, AUTH_FAIL, SET_LOADING, CLEAR_MESSAGE, SET_LOCATION } from './authActions';

let initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    error: null,
    email: '',
    password: '',
    isAuthenticated: false,
    otpSent: false,
    loading: false,
    message: '',
    role: null,
    lat: null,
    lng: null
};

// Safe JSON parse utility
function safeJsonParse(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        console.error('Invalid JSON in localStorage:', error);
        return null; // return null if parsing fails
    }
}

// This function will be called during client-side rendering
if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    initialState = {
        ...initialState,
        user: user ? safeJsonParse(user) : null,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    };
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return {
                ...state,
                lat: action.payload.lat,
                lng: action.payload.lng,
            };
        case SEND_OTP_SUCCESS:
            return {
                ...state,
                otpSent: true,
                email: action.payload.email,
                password: action.payload.password,
                message: action.payload.message,
                loading: false,
            };
        case VERIFY_OTP_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                otpSent: false,
                message: 'Authentication successful!',
                loading: false,
            };
        case AUTH_FAIL:
            return {
                ...state,
                message: '',
                error: action.payload,
                loading: false,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case CLEAR_MESSAGE:
            return {
                ...state,
                message: '',
                error: '',
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                otpSent: false,
                error: null,
                role: action.payload.role
            };
        case LOGIN_FAIL:
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                email: null,
                password: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                loading: false,
                otpSent: false,
                message: '',
                role: null
            };
        default:
            return state;
    }
};

export default authReducer;
