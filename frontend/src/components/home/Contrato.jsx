import React from "react";
import { useLocation } from "react-router-dom";

const Contrato = () => {
  const location = useLocation();
  const { contractId, dateCreated, isValid } = location.state || {};
  
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Contrato</h1>
      <div className="space-y-4">
        <p>
          <strong>Contrato ID:</strong> {contractId}
        </p>
        <p>
          <strong>Fecha de Creación:</strong> {new Date(dateCreated).toLocaleDateString()}
        </p>
        <p>
          <strong>¿Es Válido?:</strong> {isValid ? "Sí" : "No"}
        </p>
      </div>
    </div>
  );
};

export default Contrato;
