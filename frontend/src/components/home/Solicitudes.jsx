import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { getSolicitudes } from "../../api/Solicitudes";
import { fetchUserProfile } from "../../api/auth";
import { FaSpinner } from "react-icons/fa";
const SolicitudTable = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserAndSolicitudes = async () => {
      try {
        // Fetch user profile to get role
        const userRoleResponse = await fetchUserProfile();
        const role = userRoleResponse.data.role;
        console.log("User Role:", role);

        setUserRole(role);
        setIsEmpresa(role === "Empresa");

        // Fetch solicitudes from the backend
        const solicitudesResponse = await getSolicitudes();
        if (solicitudesResponse.status === 200) {
          setSolicitudes(solicitudesResponse.data);
        } else {
          console.error("Failed to fetch solicitudes:", solicitudesResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserAndSolicitudes();
  }, []);
  
  const handleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSolicitudDetails = (id) => {
    navigate(`/home/solicitudes/detalles/${id}`);
  };

  // Ir a auditores disponibles
  const handleNuevaSolicitud = () => {
    navigate("/home/solicitudes/auditores-disponibles");
  };

  const handleDeleteSelected = async () => {
    if (window.confirm("¿Estás seguro de eliminar las auditorías seleccionadas?")) {
      const token = localStorage.getItem("token");
      try {
        await Promise.all(
          selectedRows.map((id) =>
            fetch(`http://localhost:5000/solicitudes/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );
        setSolicitudes(solicitudes.filter((solicitud) => !selectedRows.includes(solicitud._id)));
        setSelectedRows([]);
      } catch (error) {
        console.error("Error deleting solicitudes:", error);
      }
    }
  };

  return (
    <div className="p-6 shadow-lg sm:w-11/12 w-[360px] mx-auto bg-white rounded-lg overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="text-4xl text-gray-500 animate-spin" />
        </div>
      ) : (
        <>
        {/* Header with buttons */}
        <div className="flex justify-between items-center mb-4 gap-5">
          <h1 className="text-2xl sm: text-sm font-bold">Solicitudes de Auditoria</h1>
          <div className="flex space-x-6 sm: text-xs ">
            {selectedRows.length > 0 && (
              <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
              <BiTrash className="text-lg" />
              <span className="font-medium">Borrar</span>
            </button>
            )}
            {isEmpresa && (
              <button
                onClick={handleNuevaSolicitud}
                className="bg-green-500 text-white px-3 py-2  rounded hover:bg-green-600">
                + Nueva Solicitud
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          
        
        {/* Table */}
        <table className="w-full table-auto overflow-x-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? solicitudes.map((s) => s.id) : [])
                  }
                  checked={selectedRows.length === solicitudes.length && solicitudes.length > 0}
                />
              </th>
              <th className="border border-gray-300 px-4 py-2">Fecha </th>
              <th className="border border-gray-300 px-4 py-2">ID de Solicitud</th>
              <th className="border border-gray-300 px-4 py-2">
              {isEmpresa ? "Auditor" : "Empresa"}
                </th>            
              <th className="border border-gray-300 px-4 py-2">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr
                key={solicitud._id}
                className={selectedRows.includes(solicitud._id) ? "bg-blue-100" : ""} >
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(solicitud.id)}
                    onChange={() => handleRowSelection(solicitud.id)}/>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(solicitud.Fecha).toISOString().split("T")[0]}
                </td>
                <td className="border border-gray-300 px-4 py-2 hover:text-brandPrimary cursor-pointer hover:underline "
                onClick={() => handleSolicitudDetails(solicitud._id)}>
                  {solicitud._id}
                  </td>
                <td className="border border-gray-300 px-4 py-2">
                {isEmpresa ? solicitud.AuditorName : solicitud.EmpresaName}
                  </td>                        
                <td className="border border-gray-300 px-4 py-2">{solicitud.Detalles}</td> 
              </tr>
            ))}
          </tbody>
        </table>
        </div>
       </>
       )}
    </div>
  );
};

export default SolicitudTable;