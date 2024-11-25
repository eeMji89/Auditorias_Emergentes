import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm">Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded border-gray-300"
              placeholder="Ingresa tu usuario"
              valueU={usuario}
              onChangeU={(e) => setUsuario(e.target.value)} // Handle username change
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block mb-2 font-bold text-sm">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ingresa tu contraseña"
              valueC={contraseña}
              onChangeC={(e) => setContraseña(e.target.value)} // Handle password change
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
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
