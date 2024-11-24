import React from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // Navigate between pages

  // Determine the current page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brandPrimary to-tertiary ">
      {/* Header */}
      <header className="bg-white text-center py-4 shadow-md ">
        <div className="flex justify-between gap-4 items-center px-8 xs:px-2 ">
          {/* Return Button */}
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Regresar
          </button>

          {/* Logo */}
          <h1 className="text-xl font-bold">ETHICHAIN</h1>

          {/* Conditional Buttons */}
          <div>
            {isLoginPage && (
              <button
                onClick={() => navigate("/register")}
                className="text-green-500 hover:underline"
              >
                Registrarse
              </button>
            )}
            {isRegisterPage && (
              <button
                onClick={() => navigate("/login")}
                className="text-green-500 hover:underline"
              >
                Inicio de Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 ">
        {children}
        </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4">
        <p>&copy; 2024 EthicChain. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired, // `node` allows any valid React content
};

export default AuthLayout;
