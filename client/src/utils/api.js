import axios from "axios";

// Get the API URL from environment variables, or use empty string (relative URL) as fallback
// Empty string will work with the proxy in development
const baseURL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL,
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
