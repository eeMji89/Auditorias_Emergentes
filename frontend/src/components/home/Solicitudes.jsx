import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
const SolicitudTable = () => {
  const navigate = useNavigate();
  const[ vistaEmpresa,setVistaEmpresa] = useState(false);//if vistaEmpresa is true, then nueva solicitud is visible, else not

  // Sample data (replace with dynamic data from the backend)
  const [solicitudes, setSolicitudes] = useState([
    {  fecha: "2023-11-21",id:"#QFF111000001", empresa: "Empresa 1", status: "Active" ,detalles:"detalles.."},
    { fecha: "2023-11-21",id:"#QFF111000001", empresa: "Empresa 1", status: "Active" ,detalles:"detalles.." },
    {fecha: "2023-11-21",id:"#QFF111000001", empresa: "Empresa 1", status: "Active" ,detalles:"detalles.."},
  ]);

  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows

  // Navigate to the form
  const handleNuevaSolicitud = () => {
    navigate("/home/solicitudes/auditores-disponibles");
  };

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
      const updatedSolicitudes = solicitudes.filter((solicitud) => !selectedRows.includes(solicitud.id));
      setSolicitudes(updatedSolicitudes);
      setSelectedRows([]); // Clear selected rows
    }
  };

  return (
    <div className="p-6 shadow-lg mx-auto bg-white rounded-lg overflow-x-auto">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Solicitudes de Auditoria</h1>
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
          <button
            onClick={handleNuevaSolicitud}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Nueva Solicitud
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(solicitudes.map((solicitud) => solicitudes.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={selectedRows.length === solicitudes.length && solicitudes.length > 0}/>
            </th>
            <th className="border border-gray-300 px-4 py-2">Fecha </th>
            <th className="border border-gray-300 px-4 py-2">ID de Solicitud</th>
            <th className="border border-gray-300 px-4 py-2">Empresa</th>            
            <th className="border border-gray-300 px-4 py-2">Estatus</th>
            <th className="border border-gray-300 px-4 py-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr
              key={solicitud.id}
              className={selectedRows.includes(solicitud.id) ? "bg-blue-100" : ""} >
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(solicitud.id)}
                  onChange={() => handleRowSelection(solicitud.id)}/>
              </td>
              <td className="border border-gray-300 px-4 py-2">{solicitud.fecha}</td> 
              <td className="border border-gray-300 px-4 py-2">{solicitud.id}</td>
              <td className="border border-gray-300 px-4 py-2">{solicitud.empresa}</td>                        
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center space-x-2">
                    <span
                    className={`w-2 h-2 rounded-full ${
                        solicitud.status === "Active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                    ></span>
                    <span className={solicitud.status === "Active" ? "text-green-500" : "text-gray-500"}>
                    {solicitud.status === "Active" ? "Valid" : "Invalid"}
                    </span>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">{solicitud.detalles}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudTable;