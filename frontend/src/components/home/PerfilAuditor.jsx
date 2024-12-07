import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuditorById } from "../../api/Usuarios" // Import API call for fetching auditor by ID

const PerfilAuditor = () => {
  const [auditor, setAuditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the auditor ID from the URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetched ID from params:", id);
    const getAuditor = async () => {
      try {
        console.log(id);
        const response = await fetchAuditorById(id); // Fetch the auditor details by ID
        setAuditor(response.data); // Update state with the fetched auditor
      } catch (err) {
        console.error("Error fetching auditor details:", err);
        setError("Error al obtener los detalles del auditor.");
      } finally {
        setLoading(false);
      }
    };

    getAuditor();
  }, [id]);

  const handleNuevaSolicitud = () => {
    console.log(auditor);
    navigate(`/home/solicitudes/nueva`, { state: { auditor } }); // Pass the auditor details to the next page
  };

  if (loading) {
    return <p className="text-center">Cargando detalles del auditor...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!auditor) {
    return <p className="text-center">Auditor no encontrado.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Profile Header */}
      <div className="flex items-center p-6 bg-green-800 text-white">
        <img
          src="https://via.placeholder.com/150" // Replace with actual image URL if available
          alt="Auditor Profile"
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <div className="ml-6">
          <h1 className="text-2xl font-bold">{auditor.Nombre_Auditor}</h1>
          <p className="text-sm">{auditor.Especializacion}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <p className="text-sm font-bold text-gray-700">Telefono:</p>
            <p className="text-gray-800">+{auditor.Telefono}</p>
          </div>
        <div>
          <p className="text-sm font-bold text-gray-700">Correo Electrónico:</p>
        <p className="text-gray-800">{auditor.Correo_Electronico}</p>
        </div>
       
        </div>
        
        <h2 className="text-sm font-bold text-gray-700 pb-8">Certificaciones:</h2>
        <div className="flex justify-center items-center w-inherited md:h-96  ">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-inherited flex justify-center items-center ">
          {auditor.Certificaciones.map((cert, index) => (
            <div key={index} className="border rounded-lg flex justify-center items-center p-4">          
               {cert.fileType === "application/pdf" ? (
        <div className="w-screen">
          <p className="text-sm font-bold text-gray-700 mb-2">{cert.fileName}</p>
          {/* Display PDF using <embed> */}
          <embed
            src={cert.fileUrl}
            type="application/pdf"
            className="w-full sm:h-96 "
          />
          {/* Optionally provide a download link */}
          <a
            href={cert.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 inline-block"
          >
            Ver PDF Completo
          </a>
        </div>
      ) : (
        // Display image
        <img
          src={cert.fileUrl}
          alt={cert.fileName}
          className="w-full h-48 object-cover mt-4"
        />
      )}
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className="flex justify-between md:text-lg text-xs p-4">
        <button
          type="button"
          onClick={() => navigate("/home/solicitudes/auditores-disponibles")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:underline"
        >
          ← Regresar
        </button>
        <button
          onClick={handleNuevaSolicitud}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Solicitar Auditoria
        </button>
      </div>
    </div>
  );
};

export default PerfilAuditor;
