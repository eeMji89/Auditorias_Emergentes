import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createSolicitud } from "../../api/Solicitudes";

const SolicitudForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auditor } = location.state || {};

  const [formData, setFormData] = useState({
    ID_Auditor: auditor?._id || "", 
    Fecha: "",
    Detalles: "",
  });

  useEffect(() => {
    console.log(auditor);
    },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      // Call the API to create the solicitud
      const response = await createSolicitud(formData);
      alert("Solicitud creada con éxito!");
      console.log("Solicitud creada:", response.data);
      navigate("/home/solicitudes"); // Redirect after submission
    } catch (error) {
      console.error("Error creating solicitud:", error);
      alert("Error al crear la solicitud. Inténtelo de nuevo.");
    }
  };

  return (
    <div className="p-6 lg:w-[800px] md:w-[600px] mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-2">Solicitud de Auditoría</h1>
      <p className="text-gray-500 mb-6">Rellene los datos de la solicitud.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="">
          <label className="block font-bold mb-2">Auditor Responsable</label>
          <input
            type="text"
            name="auditor"
            value={auditor?.Nombre_Auditor || ""}
            readOnly
            disabled
            className="w-full px-4 py-2 border rounded bg-grey-100"
            placeholder="Nombre del Auditor" />
        </div>
       
        <div>
          <label className="block font-bold mb-2">Fecha de la Auditoría</label>
          <input
            type="date"
            name="Fecha"
            value={formData.Fecha}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-bold mb-2">Detalles Adicionales</label>
          <textarea
            name="Detalles"
            value={formData.Detalles}
            onChange={handleChange}
            className="w-full px-4 py-6 border rounded"
            placeholder="Agregue detalles adicionales como motivo de auditoria aquí" />
        </div>
        <div className="flex justify-between md:text-lg text-xs">
          <button
            type="button"
            onClick={() => navigate(`/home/solicitudes/perfil-auditor/${auditor._id}`)} // Adjust to your back navigation route
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" >
            ← Regresar
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" >
            Enviar Solicitud →
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudForm;
