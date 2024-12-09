import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../../api/auth"; // API to get user profile
import { fetchAuditorById, getEmpresaById } from "../../api/Usuarios"; // API to fetch Auditor/Empresa data
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile to determine role
        const userResponse = await fetchUserProfile();
        const { ID, role } = userResponse.data;
        setUserData(userResponse.data);

        let profileResponse;
        if (role === "Auditor") {
          profileResponse = await fetchAuditorById(ID); // Fetch auditor details
        } else if (role === "Empresa") {
          profileResponse = await getEmpresaById(ID); // Fetch empresa details
        }

        if (profileResponse) {
          setProfileData(profileResponse.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Error al obtener los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Add API logic to save profile changes
      alert("Perfil actualizado con éxito.");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error al actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <p className="text-center">Cargando datos del perfil...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!profileData) {
    return <p className="text-center">Perfil no encontrado.</p>;
  }

  return (
    <div className="max-w-screen w-11/12 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Profile Header */}
      <div className="flex items-center p-6 bg-green-800 text-white relative" >
        <img
          src="https://via.placeholder.com/150" // Replace with actual image URL
          alt="User Profile"
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <div className="ml-6">
          <h1 className="text-2xl font-bold">
            {profileData.Nombre_Auditor || profileData.Nombre_Empresa || "Usuario"}
          </h1>
          <p className="text-sm">Nombre de Usuario: {userData?.username}</p>
        </div>
         {/* Edit Icon */}
         <div className="">
          <button
          onClick={() => setEditMode(!editMode)}
          className="absolute top-6 right-6 bg-white text-green-800 p-2 rounded-full hover:bg-gray-200"
          >
          <FiEdit size={20} />
         </button>
         </div>        
      </div>

      {/* General Data Section */}
      <div className="p-6 space-y-4 border-b grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="text-lg font-bold text-gray-700">Datos Generales</h2>
        <span></span>
        <div>
          <p className="text-sm font-bold text-gray-700">Correo Electrónico:</p>
          <p className="text-gray-800">{profileData.Correo_Electronico}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">Teléfono:</p>
          <p className="text-gray-800">{profileData.Telefono}</p>
        </div>
      </div>

      {/* Role-Specific Section */}
      {userData.role === "Auditor" && (
        <div className="p-6 space-y-4 border-b ">
          <h2 className="text-lg font-bold text-gray-700">Datos del Auditor</h2>
          <div>
            <p className="text-sm font-bold text-gray-700">Especialización:</p>
            <p className="text-gray-800">{profileData.Especializacion}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-700 pb-2">Certificaciones:</h2>
            <div className="flex flex-wrap gap-4">
              {profileData.Certificaciones.map((cert, index) => (
                <div key={index} className="border p-4">
                  {cert.fileType === "application/pdf" ? (
                    <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      Ver PDF
                    </a>
                  ) : (
                    <img src={cert.fileUrl} alt={cert.fileName} className="w-32 h-32 object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {userData.role === "Empresa" && (
        <div className="p-6 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="text-lg font-bold text-gray-700">Datos de la Empresa</h2>
          <span></span>
          <div>
            <p className="text-sm font-bold text-gray-700">Nombre del Representante:</p>
            <p className="text-gray-800">{profileData.Nombre_Representante}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Ubicación:</p>
            <p className="text-gray-800">{profileData.Ubicacion}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Tipo:</p>
            <p className="text-gray-800">{profileData.Tipo}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Numero de Registro:</p>
            <p className="text-gray-800">{profileData.No_Registro}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between md:text-lg text-xs p-4">
        {editMode ? (
          <>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Guardar Cambios
            </button>
          </>
        ) : (
          <>
            
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

