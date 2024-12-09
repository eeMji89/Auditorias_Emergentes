import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { fetchUserProfile } from "../../api/auth";
const AuditoriaTable = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isEmpresa, setIsEmpresa] = useState(false);

  // Sample data (replace with dynamic data from the backend)
  const [auditorias, setAuditorias] = useState([
    { id: "#QFF111000001", empresa: "Empresa 1", industria: "Textil", fecha: "2023-11-21", status: "Active" ,detalles:"detalles.."},
    { id: "#QFF111000002", empresa: "Empresa 2", industria: "Automotriz", fecha: "2023-11-22", status: "Inactive",detalles:"detalles.." },
    { id: "#QFF111000003", empresa: "Empresa 3", industria: "Alimentos", fecha: "2023-11-23", status: "Active",detalles:"detalles.." },
  ]);

  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows

  // Navigate to the form
  const handleNuevaAuditoria = () => {
    navigate("/home/auditorias/nueva");
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user profile to get role
        const userRoleResponse = await fetchUserProfile();
        const role = userRoleResponse.data.role;
        console.log("User Role:", role);

        setUserRole(role);
        setIsEmpresa(role === "Empresa");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUser();
  }, []);
  // Handle row selection
  const handleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id) // Deselect if already selected
        : [...prevSelectedRows, id] // Select otherwise
    );
  };

  // Handle delete
  const handleDeleteSelected = () => {
    if (window.confirm("¿Estás seguro de eliminar las auditorías seleccionadas?")) {
      const updatedAuditorias = auditorias.filter((auditoria) => !selectedRows.includes(auditoria.id));
      setAuditorias(updatedAuditorias);
      setSelectedRows([]); // Clear selected rows
    }
  };

  return (
    <div className="p-6 shadow-lg md:w-11/12 w-[360px] mx-auto bg-white rounded-lg overflow-x-auto absolute top-32">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="lg:text-2xl font-bold sm:text-md">Auditorías Activas</h1>
        <div className="flex space-x-6 sm: text-xs">
          {selectedRows.length > 0 && (
            <button
            onClick={handleDeleteSelected}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
>
            <BiTrash className="text-lg" />
            <span className="font-medium">Borrar</span>
          </button>
          )}
          {!isEmpresa && (
          <button
            onClick={handleNuevaAuditoria}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            + Nueva Auditoría
          </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">

      
      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 ">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 ">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(auditorias.map((auditoria) => auditoria.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={selectedRows.length === auditorias.length && auditorias.length > 0}/>
            </th>
            <th className="border border-gray-300 px-4 py-2">ID de Auditoría</th>
            <th className="border border-gray-300 px-4 py-2">Empresa</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Industria</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Estatus</th>
            <th className="border border-gray-300 px-4 py-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {auditorias.map((auditoria) => (
            <tr
              key={auditoria.id}
              className={selectedRows.includes(auditoria.id) ? "bg-blue-100" : ""} >
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(auditoria.id)}
                  onChange={() => handleRowSelection(auditoria.id)}/>
              </td>
              <td className="border border-gray-300 px-4 py-4">{auditoria.id}</td>
              <td className="border border-gray-300 px-4 py-4">{auditoria.empresa}</td>
              <td className="border border-gray-300 px-4 py-4">{auditoria.industria}</td>
              <td className="border border-gray-300 px-4 py-4">{auditoria.fecha}</td>            
              <td className="border border-gray-300 px-4 py-4">
                <div className="flex items-center space-x-2">
                    <span
                    className={`w-2 h-2 rounded-full ${
                        auditoria.status === "Active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                    ></span>
                    <span className={auditoria.status === "Active" ? "text-green-500" : "text-gray-500"}>
                    {auditoria.status === "Active" ? "Valid" : "Invalid"}
                    </span>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">{auditoria.detalles}</td> 
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AuditoriaTable;



