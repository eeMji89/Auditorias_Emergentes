
import { useDropzone } from "react-dropzone";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAuditoria } from "../../api/Auditorias";
import { fetchUserProfile } from "../../api/auth";

const AuditoriaForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { solicitud } = location.state || {};

  const [formData, setFormData] = useState({
    ID_Auditor: solicitud?.ID_Auditor || "",
    ID_Empresa: solicitud?.ID_Empresa || "", 
    empresa: solicitud?.EmpresaName || "",
    Fecha: new Date(solicitud.Fecha).toISOString().split("T")[0],
    Estatus: "Active", // Default status
    Descripcion: "",
    Salario: "",
    Horas_Extra: "",
    Seguro: "",
    Vacaciones: "",
    Comentarios: "",
    auditor: solicitud?.AuditorName|| "",
    fecha: "",
    descripcion: "", // Updated field
    salario: "",
    objetivo: "",
    horasExtras: "",
    seguro: false,
    vacaciones: false,
    beneficios: [
        { label: "Seguro de Salud", checked: false },
        { label: "Vacaciones Pagadas", checked: false },
      ],
    documentacion: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDrop = (acceptedFiles) => {
    setFormData((prev) => ({
      ...prev,
      documentacion: acceptedFiles[0],
    }));
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
    maxFiles: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Send the formData to the backend
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl p-8 ">
      <h1 className="text-2xl font-bold mb-4">Nueva Auditoría</h1>
      <form onSubmit={handleSubmit} className="space-y-6 ">
      <h1 className="font-bold text-neutralDGrey">Información Basica</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            
          <div>
            <label className="block font-bold mb-2">Nombre de la Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              readOnly
              disabled
              className="w-full px-4 py-2 border rounded"/>
          </div>
          <div>
            <label className="block font-bold mb-2">Auditor Responsable</label>
            <input
              type="text"
              name="auditor"
              value={formData.auditor}
              readOnly
              disabled
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Fecha</label>
            <input
              type="date"
              name="Fecha"
              value={formData.Fecha}
              readOnly
              disabled
              className="w-full px-4 py-2 border rounded"/>
          </div>
          <span></span>
          <h1 className="font-bold text-neutralDGrey">Detalles de la Auditoría</h1>
          <span></span>
          <div>
            <label className="block font-bold mb-2">Descripción</label> {/* Updated label */}
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Describa los detalles de la auditoría"/>
          </div>
          <div>
            <label className="block font-bold mb-2">Salario Base</label>
            <input
              type="text"
              name="salario"
              value={formData.salario}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Ej. 50000"  />
          </div>
          <div>
            <label className="block font-bold mb-2">Pago de Horas Extras</label>
            <select
              name="horasExtras"
              value={formData.horasExtras}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded" >
              <option value="">Seleccione</option>
              <option value="Cumple">Cumple</option>
              <option value="No Cumple">No Cumple</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Beneficios Adicionales</label>
            <div className="flex items-center space-x-4 ">
              <label>
                <input
                  type="checkbox"
                  name="seguro"
                  checked={formData.seguro}
                  onChange={handleChange} />{" "}
                Seguro de Salud
              </label>
              <label>
                <input
                  type="checkbox"
                  name="vacaciones"
                  checked={formData.vacaciones}
                  onChange={handleChange} />{" "}
                Vacaciones Pagadas
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block font-bold mb-2">Documentación</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded px-4 py-12 text-center ${
              isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {formData.documentacion ? (
              <p>{formData.documentacion.name}</p>
            ) : (
              <p>
                {isDragActive
                  ? "Suelta el archivo aquí..."
                  : "Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo."}
              </p>
            )}
          </div>
        </div>
        <div className=" flex py-5 items-center justify-center ">
          <button
            onClick={() => navigate("/contrato")}
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Verificar Auditoría →
          </button>  
        </div>
        
      </form>
    </div>
  );
};

export default AuditoriaForm;
