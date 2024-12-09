import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContratosById } from "../../api/Contratos"; // Import your API function

const Contrato = () => {
  const { id } = useParams(); // Get the contract ID from route parameters
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await getContratosById(id);
        setContract(response.data);
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Failed to load contract data.");
      }
    };

    fetchContract();
  }, [id]);

  if (error) {
    return <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl p-8">{error}</div>;
  }

  if (!contract) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl p-8">Loading...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Contrato</h1>
      <div className="space-y-4">
        <p>
          <strong>Nombre de la Empresa:</strong> {contract.empresa}
        </p>
        <p>
          <strong>Auditor:</strong> {contract.auditor}
        </p>
        <p>
          <strong>Fecha de Creación:</strong> {new Date(contract.dateCreated).toLocaleDateString()}
        </p>
        <p>
          <strong>¿Es Válido?:</strong> {contract.isValid ? "Sí" : "No"}
        </p>
      </div>
    </div>
  );
};

export default Contrato;
