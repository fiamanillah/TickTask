import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Allow cookies to be sent with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
