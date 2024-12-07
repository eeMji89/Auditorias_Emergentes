import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
}, (error) => {
  return Promise.reject(error);
}); 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Redirecting to login.");
      // Optional: Redirect to login page if unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;