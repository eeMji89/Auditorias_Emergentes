import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import { useNavigate } from "react-router-dom";

const AuditoriasPage = () => {
  const navigate = useNavigate();
  const handleNuevaSolicitud = () => {
    navigate("/home/solicitudes/perfil-auditor");
  };
  return (
    <div className="flex h-screen bg-gray-50">

        {/* Page Content */}
        <main className="flex-grow h-screen p-6">
          <h2 className="text-2xl font-bold mb-2">Auditores Disponibles</h2>
          <p className="text-gray-600 mb-6">Subheading</p>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example cards */}
            {Array(6)
              .fill("")
              .map((_, index) => (
                <div key={index} onClick={handleNuevaSolicitud} className="border rounded-lg p-6 w-md flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Auditor"
                    className="w-12 h-12 rounded-full"/>
                  <div>
                    <h3 className="font-bold">Title</h3>
                    <p className="text-gray-500">Description</p>
                  </div>
                </div>
              ))}
          </div>
        </main>
    </div>
  );
};

export default AuditoriasPage;
