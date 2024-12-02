import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const RegisterComplete = ({ formData, onSubmit }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user modifies fields
  };

  const handleRegister = () => {
    const { usuario, password, confirmPassword } = credentials;

    // Validation
    if (!usuario || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);
    onSubmit({ Nombre_Usuario: usuario, Contraseña: password }); // Pass final credentials to RegisterPage
    setIsSubmitting(false);
    navigate("/login");
    // Simulate API call
    
  };

  return (
    <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Datos de Inicio de Sesión
      </h1>
      <form className="bg-white p-4 rounded  max-w-md  w-full">
        {error && (
          <div className="mb-4 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-sm">Usuario</label>
          <input
            type="text"
            name="usuario"
            value={credentials.usuario}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Crea tu usuario"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-sm">Contraseña</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Crea tu contraseña"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-sm">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Confirma tu contraseña"
          />
        </div>
        <button
          type="button"
          onClick={handleRegister}
          className={`w-full py-2 px-4 rounded ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition-all`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};

export default RegisterComplete;
