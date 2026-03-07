import axios from "axios";

// ==========================================
// 🔥 AXIOS INSTANCE CONFIGURATION
// ==========================================

const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// 🔐 REQUEST INTERCEPTOR (Attach JWT Token)
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ==========================================
// 🚨 RESPONSE INTERCEPTOR (Global Error Handling)
// ==========================================

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If token expired or unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
