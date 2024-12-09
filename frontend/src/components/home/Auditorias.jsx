import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { fetchUserProfile } from "../../api/auth";
import { getAuditorias } from "../../api/Auditorias";
import { FaSpinner } from "react-icons/fa";

const AuditoriaTable = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [auditorias, setAuditorias] = useState([]); // Replace with fetched data
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);


  // Navigate to the form
  const handleNuevaAuditoria = () => {
    navigate("/home/auditorias/nueva");
  };
  useEffect(() => {
    const fetchUserAndAuditorias = async () => {
      try {
        // Fetch user role
        const userRoleResponse = await fetchUserProfile();
        const role = userRoleResponse.data.role;
        setUserRole(role);
        setIsEmpresa(role === "Empresa");

        // Fetch auditorias from backend
        const auditoriasResponse = await getAuditorias();
        if (auditoriasResponse.data.success) {
          setAuditorias(auditoriasResponse.data.data);
        } else {
          console.error("Failed to fetch auditorias:", auditoriasResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAuditorias();
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

  const handleAuditoriaDetails = (id) => {
    navigate(`/home/auditorias/detalles/${id}`);
  };

  return (
    <div className="p-6 shadow-lg md:w-11/12 w-[360px] mx-auto bg-white rounded-lg overflow-x-auto absolute top-32">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="text-4xl text-gray-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Header with buttons */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="lg:text-2xl font-bold sm:text-md">Auditorías Activas</h1>
            <div className="flex space-x-6">
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
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  + Nueva Auditoría
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedRows(e.target.checked ? auditorias.map((s) => s._id) : [])
                      }
                      checked={selectedRows.length === auditorias.length && auditorias.length > 0}
                    />
                  </th>
                  <th className="border border-gray-300 px-4 py-2">ID de Auditoría</th>
                  <th className="border border-gray-300 px-4 py-2">Empresa</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha</th>
                  <th className="border border-gray-300 px-4 py-2">Estatus</th>
                  <th className="border border-gray-300 px-4 py-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {auditorias.map((auditoria) => (
                  <tr
                    key={auditoria._id}
                    className={selectedRows.includes(auditoria._id) ? "bg-blue-100" : ""}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(auditoria._id)}
                        onChange={() => handleRowSelection(auditoria._id)}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 hover:text-brandPrimary cursor-pointer hover:underline">
                      onClick={() => handleAuditoriaDetails(auditoria._id)}
                      {auditoria._id}
                      </td>
                    <td className="border border-gray-300 px-4 py-2">{auditoria.ID_Empresa}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(auditoria.Fecha).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{auditoria.Estatus}</td>
                    <td className="border border-gray-300 px-4 py-2">{auditoria.Descripcion}</td>
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

export default AuditoriaTable;



