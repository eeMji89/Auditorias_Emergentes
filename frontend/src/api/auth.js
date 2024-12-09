import { datalist } from "framer-motion/client";
import api from "./api";

// User Login
export const login = (credentials) => {
  return api.post("/login", credentials);
};

// User Registration
export const register = (userData) => {
  return api.post("/register", userData);
};

// User Logout
export const logout = () => {
  return api.post("/logout");
};

// Fetch User Profile
export const fetchUserProfile = () => {
  return api.get("/userauth");
};

export const updatePassword = (data) => {
  return api.put("/update-password", data);
};