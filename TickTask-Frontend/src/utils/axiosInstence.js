import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://ticktask-backend.amanillah.com',
    withCredentials: true, // Allow cookies to be sent with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
