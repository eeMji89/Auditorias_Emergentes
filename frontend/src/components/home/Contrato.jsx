import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContratosById } from "../../api/Contratos";
import { getEmpresaById } from "../../api/Usuarios";
import { fetchAuditorById } from "../../api/Usuarios";

const Contrato = () => {
  const { id } = useParams(); 
  console.log("Contrato data received:", location.state);
  const [contract, setContract] = useState(null);
  const [empresaName, setEmpresaName] = useState("");
  const [auditorName, setAuditorName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        console.log(id);
        const response = await getContratosById(id);
        const contractData = response.data;

        setContract(response.data);

        if (contractData.empresaId) {
          const empresaResponse = await getEmpresaById(contractData.empresaId);
          setEmpresaName(empresaResponse.data.Nombre_Empresa); // Assuming the name is returned in `data.name`
        }
        if (contractData.auditorId) {
          const auditorResponse = await fetchAuditorById(contractData.auditorId);
          setAuditorName(auditorResponse.data.Nombre_Auditor); // Assuming the name is returned in `data.name`
        }

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
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 w-3/4">
      <div className="bg-green-600 text-white text-center rounded-t-xl py-4">
        <h1 className="text-3xl font-extrabold">Contrato</h1>
      </div>
      <div className="space-y-6 p-8 text-gray-800">
        <div className="flex items-center space-x-2">
          <strong className="text-lg font-semibold text-green-700">
            Nombre de la Empresa:
          </strong>
          <span className="text-xl font-medium">{empresaName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="text-lg font-semibold text-green-700">Auditor:</strong>
          <span className="text-xl font-medium">{auditorName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="text-lg font-semibold text-green-700">
            Fecha de Creación:
          </strong>
          <span className="text-xl font-medium">
            {new Date(contract.dateCreated).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="text-lg font-semibold text-green-700">
            ¿Es Válido?:
          </strong>
          <span className="text-xl font-medium">
            {contract.isValid ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </div>
  );  
};

export default Contrato;
