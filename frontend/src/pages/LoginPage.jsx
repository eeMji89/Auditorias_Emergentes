import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom"; // Add to navigate to another page on successful login

const LoginPage = () => {
  const [usuario, setUsuario] = useState(""); // State for the username
  const [contraseña, setContraseña] = useState(""); // State for the password
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate(); // For navigation after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post("http://localhost:5000/signin", {
        Nombre_Usuario: usuario,
        Contraseña: contraseña,
      });

      // If login is successful, store the JWT token
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token in localStorage for future requests

      // Optionally, navigate to a protected page after login
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm">Usuario</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)} // Handle username change
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-bold text-sm">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)} // Handle password change
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brandPrimary text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
