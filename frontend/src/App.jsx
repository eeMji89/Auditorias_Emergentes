import './App.css'
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {

  return (
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/register/empresa" element={<RegisterPage />} />
    <Route path="/register/auditor" element={<RegisterPage />} />
    <Route path="/home" element={<HomePage />} />
  </Routes>
  )
}

export default App
