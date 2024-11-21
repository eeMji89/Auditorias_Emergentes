import React from "react";
import PropTypes from "prop-types";
import mobilelogin from "../assets/mobile-login.png";

const RegisterChoice = ({ onSelect }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white p-4 rounded-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 mt-8 text-center">Regístrate</h1>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-4xl">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={mobilelogin} alt="Login Illustration" className="w-4/5 md:w-full max-w-md" />
        </div>

        {/* Buttons Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4">
          <button
            onClick={() => onSelect("empresa")} // Set entity type to "empresa"
            className="w-full max-w-sm bg-neutralSilver text-brandPrimary py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-all"
          >
            Como Empresa →
          </button>
          <button
            onClick={() => onSelect("auditor")} // Set entity type to "auditor"
            className="w-full max-w-sm bg-neutralSilver text-brandPrimary py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-all"
          >
            Como Auditor →
          </button>
        </div>
      </div>
    </div>
  );
};

RegisterChoice.propTypes = {
  onSelect: PropTypes.func.isRequired, // Callback to pass selected entity type
};

export default RegisterChoice;
