import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { getSolicitudes } from "../../api/Solicitudes";
import { fetchAuditorById,getEmpresaById } from "../../api/Usuarios";
const SolicitudTable = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [vistaEmpresa, setVistaEmpresa] = useState(false); // si es empresa el boton sera visible

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await getSolicitudes(); // Call the API method
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        setSolicitudes(response.data); 
        // Check if the user is an empresa
        if (response.data.length > 0) {
          setVistaEmpresa(response.data[0].role === "Empresa");
        }
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
      }
    };
    fetchSolicitudes();
  }, []);

  const handleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
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
    <div className="p-6 shadow-lg lg:w-[1200px] md:w-[800px] sm: w-[360px]  mx-auto bg-white rounded-lg overflow-x-auto">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-4 gap-5">
        <h1 className="text-2xl sm: text-sm font-bold">Solicitudes de Auditoria</h1>
        <div className="flex space-x-6 sm: text-xs ">
          {selectedRows.length > 0 && (
            <button
            onClick={handleDeleteSelected}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
>
            <BiTrash className="text-lg" />
            <span className="font-medium">Borrar</span>
          </button>
          )}
          <button
            onClick={handleNuevaSolicitud}
            className="bg-blue-500 text-white px-3 py-2  rounded hover:bg-blue-600">
            + Nueva Solicitud
          </button>
        </div>
      </div>

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
            <th className="border border-gray-300 px-4 py-2">Empresa</th>            
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
              <td className="border border-gray-300 px-4 py-2">{solicitud._id}</td>
              <td className="border border-gray-300 px-4 py-2">{solicitud.ID_Empresa}</td>                        
              <td className="border border-gray-300 px-4 py-2">{solicitud.Detalles}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudTable;