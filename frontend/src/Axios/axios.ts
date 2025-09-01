// Axios/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Your Spring Boot backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // keep this if you're using cookies
});

// ✅ Automatically attach token for every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
