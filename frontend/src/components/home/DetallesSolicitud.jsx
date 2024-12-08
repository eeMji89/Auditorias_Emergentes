import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSolicitudById } from "../../api/Solicitudes";

const SolicitudDetail = () => {
  const { id } = useParams(); // Get the solicitud ID from the URL
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSolicitudDetails = async () => {
      try {
        const response = await fetchSolicitudById(id);
        setSolicitud(response.data);
      } catch (err) {
        console.error("Error fetching solicitud details:", err);
        setError("Error fetching solicitud details.");
      } finally {
        setLoading(false);
      }
    };

    getSolicitudDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center">Cargando detalles de la solicitud...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!solicitud) {
    return <p className="text-center">Solicitud no encontrada.</p>;
  }

  return (
    <div className="p-6 lg:w-[800px] md:w-[600px] mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Detalles de la Solicitud</h1>
      <div className="space-y-4">
        <p>
          <strong>Fecha de Auditoría:</strong>{" "}
          {new Date(solicitud.Fecha).toISOString().split("T")[0]}
        </p>
        <p>
          <strong>Empresa Responsable:</strong> {solicitud.EmpresaName}
        </p>
        <p>
          <strong>Auditor Asignado:</strong> {solicitud.AuditorName}
        </p>
        <p>
          <strong>Detalles:</strong> {solicitud.Detalles}
        </p>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/home/solicitudes")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ← Volver a Solicitudes
        </button>
      </div>
    </div>
  );
};

export default SolicitudDetail;
