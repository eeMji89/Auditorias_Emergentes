
import { useDropzone } from "react-dropzone";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAuditoria } from "../../api/Auditorias";
import { fetchUserProfile } from "../../api/auth";
import { createContrato } from "../../api/Contratos";

const AuditoriaForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { solicitud } = location.state || {};

  const [formData, setFormData] = useState({
    ID_Auditor: solicitud?.ID_Auditor || "",
    ID_Empresa: solicitud?.ID_Empresa || "", 
    Empresa: solicitud?.EmpresaName || "",
    Fecha: new Date(solicitud.Fecha).toISOString().split("T")[0],
    Estatus: "Valido", 
    Auditor: solicitud?.AuditorName|| "",
    Descripcion: "", 
    Salario: "",
    HorasExtras: "",
    Seguro:{ label: "Seguro de Salud", checked: false },
    Vacaciones: { label: "Vacaciones Pagadas", checked: false },
    Comentarios: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const response = await createAuditoria(formData);
    console.log("Auditoría :", response.data);
    console.log("Auditoría creada:", response.data);
    // Parse numeric and boolean values
    const salario = parseFloat(formData.Salario);
    const horasExtras = parseInt(formData.HorasExtras, 10);
    const seguro = formData.Seguro;
    const vacaciones = formData.Vacaciones;

    // Validate contract conditions
    let conditionCount = 0;
    if (salario < 10500) conditionCount++;
    if (!vacaciones) conditionCount++;
    if (!seguro) conditionCount++;
    if (horasExtras > 5) conditionCount++;

    const IsValid = conditionCount < 3; 

    const contractData = {
      Empresa: formData.ID_Empresa,
      Auditor: formData.ID_Auditor,
      DateCreated: new Date(),
      Salario: formData.Salario,
      HorasExtras: formData.HorasExtras,
      Seguro: formData.Seguro,
      Vacaciones: formData.Vacaciones,
    };

    try {
      await createContrato(contractData);
      alert("Contrato creado exitosamente!");
      navigate("/contrato", { state: { contractData } });
    } catch (error) {
      console.error("Error al crear el contrato:", error);
      alert("Hubo un error al crear el contrato. Intenta nuevamente.");
    }
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
              value={formData.Empresa}
              readOnly
              disabled
              className="w-full px-4 py-2 border rounded"/>
          </div>
          <div>
            <label className="block font-bold mb-2">Auditor Responsable</label>
            <input
              type="text"
              name="auditor"
              value={formData.Auditor}
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
              name="Descripcion"
              value={formData.Descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Describa los detalles de la auditoría"/>
          </div>
          <div>
            <label className="block font-bold mb-2">Salario Base</label>
            <input
              type="text"
              name="Salario"
              value={formData.Salario}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Ej. 50000"  />
          </div>
          <div>
            <label className="block font-bold mb-2">Pago de Horas Extras</label>
            <input
              type="text"
              name="HorasExtras"
              value={formData.HorasExtras}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded" 
              placeholder="Ej. 5"/>
          </div>
          <div>
            <label className="block font-bold mb-2">Beneficios Adicionales</label>
            <div className="flex items-center space-x-4 ">
              <label>
                <input
                  type="checkbox"
                  name="Seguro"
                  checked={formData.Seguro}
                  onChange={handleChange} />{" "}
                Seguro de Salud
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Vacaciones"
                  checked={formData.Vacaciones}
                  onChange={handleChange} />{" "}
                Vacaciones Pagadas
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block font-bold mb-2">Comentarios</label>
          <textarea
              name="Comentarios"
              value={formData.Comentarios}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Comentarios extra respecto a la auditoria"/>
        </div>
        <div className=" flex py-5 items-center justify-center ">
          <button
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
