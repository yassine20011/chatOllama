import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API_BASE_URL', API_BASE_URL);
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token'); 
        console.log('token', token);
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                console.log('Access token has expired');
            } else {
                config.headers["x-access-token"] = token;
            }
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

export default axiosInstance;
