import React  , { useState }from "react";
import { useNavigate } from "react-router-dom";
import CertificateGallery from "./CertificateGallery";
// eslint-disable-next-line react/prop-types
const PerfilAuditor = ({ auditor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(auditor);
    const [certificates, setCertificates] = useState([]);
    const toggleEditing = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };
    const navigate = useNavigate();
    const defaultAuditor = {
        name: "Juan Pérez",
        role: "Auditor Senior",
        email: "juan.perez@example.com",
        phone: "+1 234 567 890",
        company: "Empresa de Auditoría SA",
        auditsCompleted: 25,
        profileImage: "https://via.placeholder.com/150", // Replace with actual image URL
        bio: "Especialista en auditorías financieras y cumplimiento normativo. Más de 10 años de experiencia liderando proyectos de auditoría a nivel internacional.",
      };

    const auditorData = auditor || defaultAuditor;
    const handleNuevaSolicitud = () => {
        navigate("/home/solicitudes/nueva");
      };
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex items-center p-6 bg-green-800 text-white">
          <img
            src={auditorData.profileImage}
            alt="Auditor Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold"></h1>
            <p className="text-sm">{auditorData.role}</p>
            <p className="text-sm mt-1">{auditorData.company}</p>
          </div>
        </div>
  
        {/* Profile Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Correo Electrónico</h3>
              <p className="text-gray-800">{auditorData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
              <p className="text-gray-800">{auditorData.phone}</p>
            </div>
          </div>
  
          <h2 className="text-xl font-semibold text-gray-700">Información Adicional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Auditorías Completadas</h3>
              <p className="text-gray-800">{auditorData.auditsCompleted}</p>
            </div>
          </div>
  
          <h2 className="text-xl font-semibold text-gray-700">Biografía</h2>
          <p className="text-gray-800">{auditorData.bio}</p>
        </div>
        <div className="  flex justify-between md:text-lg text-xs p-4">
        <button
            type="button"
            onClick={() => navigate("/home/solicitudes/auditores-disponibles")} // Adjust to your back navigation route
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:underline" >
            ← Regresar
          </button>
            <button onClick={handleNuevaSolicitud} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ">
                Solicitar Auditoria
            </button>
        </div>
      </div>
    );
};
export default PerfilAuditor;