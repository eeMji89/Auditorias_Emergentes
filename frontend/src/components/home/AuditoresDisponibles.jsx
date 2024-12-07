import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuditores } from "../../api/Usuarios"

const AuditoriasPage = () => {
  const [auditores, setAuditores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNuevaSolicitud = (auditorId) => {
    navigate(`/home/solicitudes/perfil-auditor/${auditorId}`);
  };

  useEffect(() => {
    const getAuditores = async () => {
      try {
        const response = await fetchAuditores(); // Fetch from the backend
        if (response.data.success) {
          setAuditores(response.data.data); // Access the "data" field in the response
        } else {
          setError("No se pudo cargar la lista de auditores.");
        } // Assuming response.data is the array of auditors
      } catch (err) {
        console.error("Error fetching auditors:", err);
        setError("Error al obtener la lista de auditores.");
      } finally {
        setLoading(false);
      }
    };

    getAuditores();
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">

        {/* Page Content */}
        <main className="flex-grow h-screen p-6">
          <h2 className="text-2xl font-bold mb-2">Auditores Disponibles</h2>
          <p className="text-gray-600 mb-6">Encuentra al auditor adecuado para tus necesidades.</p>
          
          {/* Loading/Error States */}
        {loading ? (
          <p className="text-gray-500">Cargando auditores...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auditores.map((auditor) => (
              <div
                key={auditor._id}
                onClick={() => handleNuevaSolicitud(auditor._id)}
                className="border rounded-lg p-6 w-md flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src="https://via.placeholder.com/50"
                  alt="Auditor"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{auditor.Nombre_Auditor}</h3>
                  <p className="text-gray-500">{auditor.Especializacion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        </main>
    </div>
  );
};

export default AuditoriasPage;
