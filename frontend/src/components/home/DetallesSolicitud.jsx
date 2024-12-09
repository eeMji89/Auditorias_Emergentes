import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getSolicitudById,deleteSolicitud } from "../../api/Solicitudes";
import { createNotification } from "../../api/Usuarios";
import {fetchUserProfile} from "../../api/auth";
import { toast } from "react-toastify";

const SolicitudDetail = () => {
  const { id } = useParams(); // Get the solicitud ID from the URL
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUserRole(userProfile.data.role);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const getSolicitudDetails = async () => {
      try {
        const response = await getSolicitudById(id);
        setSolicitud(response.data);
      } catch (err) {
        console.error("Error fetching solicitud details:", err);
        setError("Error fetching solicitud details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
    getSolicitudDetails();
  }, [id]);

  const handleAccept = () => {
    setIsAccepted(true); // Mark as accepted
  };
  const handleCancel = async () => {
    try {
      await deleteSolicitud(id);
      toast.success("Solicitud cancelada con éxito.");
      navigate("/home/solicitudes");
    } catch (err) {
      console.error("Error canceling solicitud:", err);
      toast.error("Error al cancelar la solicitud.");
    }
  };
  const handleReject = async () => {
    try {
      await deleteSolicitud(id);
      await createNotification({
        recipientId: solicitud.ID_Empresa,
        message: `Su solicitud con ID: #${id} ha sido rechazada.`,
        type: "Solicitud Rechazada",
      });

      toast.success("Solicitud rechazada con éxito.");
      navigate("/home/solicitudes"); // Redirect back to solicitudes
    } catch (err) {
      console.error("Error rejecting solicitud:", err);
      toast.error("Error al rechazar la solicitud.");
    }
  };
  const handleRegistrarAuditoria = () => {
    navigate(`/home/auditorias/nueva`, { state: { solicitud } }); // Redirect to the auditoría form
  };

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
    <div className="space-y-3 w-11/12">
        <div className="flex justify-between items-center bg-white p-4  shadow-sm rounded-xl">
        <button
        onClick={() => navigate("/home/solicitudes")}
        className="bg-green-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
        >
        ← Volver a Solicitudes
        </button>
    </div>
    
    <div className="p-12 max-w-6xl mx-auto rounded-xl shadow-md bg-white space-y-6">
        <div className="space-y-2 mt-6 ">
            <h1 className="text-xl font-bold text-gray-800">
            Detalles de Solicitud ID: <span className="text-green-800">#{id}</span>
            </h1>
            <p className="text-sm text-gray-500">Solicitud de Auditoria</p>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-4">
            <p>
                <span className="font-semibold">Nombre de la Empresa:</span> {solicitud.EmpresaName}
            </p>
            <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(solicitud.Fecha).toLocaleDateString()}
            </p>
            </div>

            <div className="space-y-4">
            <p>
                <span className="font-semibold">Auditor:</span>{" "}
                {solicitud.AuditorName}
            </p>
           
            </div>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Detalles de la Auditoría</h2>
            <p>{solicitud.Detalles}</p>
        </div>

    
       {/* Action Buttons */}
       <div className="flex justify-end space-x-4 sm:text-sm">
          {userRole === "Empresa" && (
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancelar
            </button>
          )}
          {userRole === "Auditor" && !isAccepted && (
            <>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Aceptar
              </button>
            </>
          )}
          {userRole === "Auditor" && isAccepted && (
            <button
              onClick={handleRegistrarAuditoria}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Registrar Auditoría
            </button>
          )}
        </div>
      </div>
   </div>

  );
};

export default SolicitudDetail;
