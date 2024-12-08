import React from "react";
import Sidebar from "../components/home/Sidebar"; 

const PerfilAuditor = () => {
  return (
    <div className="perfil-container">
      {/* Header */}
      <header className="bg-green-800 text-white py-4 px-6">
        <h1 className="text-xl font-bold">ETHICCHAIN</h1>
      </header>

      <div className="content">
        <Sidebar />
        <div className="main-content">
          <h2>Perfil del Auditor</h2>
          <div className="card">
            <h3>Información Personal</h3>
            <p><strong>Nombre:</strong> Juan Pérez</p>
            <p><strong>País:</strong> México</p>
            <p><strong>Teléfono:</strong> +52 123-456-7890</p>
            <p><strong>Correo Electrónico:</strong> juanperez@gmail.com</p>
            <p><strong>Rol:</strong> Auditor</p>
          </div>
          <div className="card">
            <h3>Detalles del Auditor</h3>
            <p><strong>Especialización:</strong> Seguridad Informática</p>
            <p><strong>Certificaciones:</strong> CISSP, CISM</p>
          </div>
          <button className="bg-green-700 text-white py-2 px-4 rounded mt-4 hover:bg-green-600">
            Ver auditorías disponibles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilAuditor;
