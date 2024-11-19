import React from "react";
import AuthLayout from "../components/AuthLayout";
const RegisterPage = () => {
  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm">Usuario</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm">Correo</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Ingresa tu correo"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-bold text-sm">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Registrarse
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
