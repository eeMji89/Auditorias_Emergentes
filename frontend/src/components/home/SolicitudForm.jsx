import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    auditor: "",
    tipoAuditoria: "",
    fecha: "",
    detalles: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <div className="p-6 md:w-[800px] mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-2">Solicitud de Auditoría</h1>
      <p className="text-gray-500 mb-6">Subheading</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold mb-2">Auditor Responsable</label>
          <input
            type="text"
            name="auditor"
            value={formData.auditor}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Nombre del Auditor" />
        </div>
       
        <div>
          <label className="block font-bold mb-2">Fecha de la Auditoría</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-bold mb-2">Detalles Adicionales</label>
          <textarea
            name="detalles"
            value={formData.detalles}
            onChange={handleChange}
            className="w-full px-4 py-6 border rounded"
            placeholder="Agregue detalles adicionales como motivo de auditoria aquí" />
        </div>
        <div className="flex justify-between md:text-lg text-xs">
          <button
            type="button"
            onClick={() => navigate("/home")} // Adjust to your back navigation route
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
