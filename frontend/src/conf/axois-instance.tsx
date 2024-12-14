import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { config } from 'dotenv';


const API_BASE_URL = "http://localhost:3000/";

console.log('API_BASE_URL', API_BASE_URL);
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token'); // https only cookie for production
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                console.log('Access token has expired');
                // TODO: logout user and redirect to login page
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

export default axiosInstance;
