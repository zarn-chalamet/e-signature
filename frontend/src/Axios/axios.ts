import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for cookies
});


export default axiosInstance;