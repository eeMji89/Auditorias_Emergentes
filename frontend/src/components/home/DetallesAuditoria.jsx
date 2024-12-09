import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuditoriabyId } from "../../api/Auditorias"; // API call to fetch auditoria details
import { toast } from "react-toastify";

const AuditoriaDetail = () => {
  const { id } = useParams(); // Get the auditoria ID from the URL
  const navigate = useNavigate();
  const [auditoria, setAuditoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAuditoriaDetails = async () => {
      try {
        const response = await getAuditoriabyId(id);
        setAuditoria(response.data); 
      } catch (err) {
        console.error("Error fetching auditoria details:", err);
        setError("Error al obtener los detalles de la auditoría.");
      } finally {
        setLoading(false);
      }
    };

    getAuditoriaDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center">Cargando detalles de la auditoría...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!auditoria) {
    return <p className="text-center">Auditoría no encontrada.</p>;
  }

  return (
    <div className="space-y-3 w-11/12">
      <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-xl">
        <button
          onClick={() => navigate("/home/auditorias")}
          className="bg-green-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
        >
          ← Volver a Auditorías
        </button>
      </div>

      <div className="p-12 max-w-6xl mx-auto rounded-xl shadow-md bg-white space-y-6">
        <div className="space-y-2 mt-6">
          <h1 className="text-xl font-bold text-gray-800">
            Detalles de Auditoría ID: <span className="text-green-800">#{auditoria._id}</span>
          </h1>
          <p className="text-sm text-gray-500">Información de la auditoría</p>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Empresa Auditada:</span> {auditoria.EmpresaName}
            </p>
            <p>
              <span className="font-semibold">Auditor:</span> {auditoria.AuditorName}
            </p>
            <p>
              <span className="font-semibold">Fecha:</span> {new Date(auditoria.Fecha).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-4">
            <p>
              <span className="font-semibold">Estado:</span> {auditoria.Estatus}
            </p>
            <p>
              <span className="font-semibold">Tipo de Industria:</span> {auditoria.Industria}
            </p>
            <p>
              <span className="font-semibold">Comentarios:</span> {auditoria.Comentarios || "No hay comentarios"}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Detalles Adicionales</h2>
          <p>{auditoria.Descripcion || "No se proporcionaron detalles adicionales."}</p>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaDetail;
