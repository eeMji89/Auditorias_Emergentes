import React from "react";
import Sidebar from "./Sidebar";

const PerfilEmpresa = () => {
  return (
    <div className="perfil-container">
      {/* Header */}
      <header className="bg-green-800 text-white py-4 px-6">
        <h1 className="text-xl font-bold">ETHICCHAIN</h1>
      </header>

      <div className="content">
        <Sidebar />
        <div className="main-content">
          <h2>Perfil de la Empresa</h2>
          <div className="card">
            <h3>Información de la Empresa</h3>
            <p><strong>Nombre de la Empresa:</strong> Nexcent Corp</p>
            <p><strong>Tipo:</strong> Consultoría</p>
            <p><strong>No. Registro:</strong> 12345-6789</p>
            <p><strong>Ubicación:</strong> Ciudad de México, México</p>
          </div>
          <div className="card">
            <h3>Representante</h3>
            <p><strong>Nombre:</strong> Ana López</p>
            <p><strong>Cargo:</strong> Gerente General</p>
          </div>
          <button className="bg-green-700 text-white py-2 px-4 rounded mt-4 hover:bg-green-600">
            Solicitar Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilEmpresa;
