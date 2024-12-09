import './App.css'
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/register/empresa" element={<RegisterPage />} />
    <Route path="/register/auditor" element={<RegisterPage />} />
    <Route path="/contrato" element={<Contrato />} />
    <Route path="/home/*" element={
       <ProtectedRoute>
       <HomePage />
     </ProtectedRoute>
    } />
  </Routes>
  <ToastContainer  position="top-center" newestOnTop={true}/>
  </>
  )
}

export default App
