import React, { useState } from "react";
import PropTypes from "prop-types";


const RegisterForm = ({ entityType, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [certifications, setCertifications] = useState(null);

  const requiredFields = {
    empresa: [
      "nombreEmpresa",
      "paisResidencia",
      "tipoIndustria",
      "ubicacion",
      "numeroRegistro",
      "nombreRepresentante",
      "cargo",
      "correoElectronico",
      "telefono",
    ],
    auditor: ["nombre", "telefono", "correo", "pais", "especializacion"],
  };
  
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "Este campo es obligatorio.";
    } else {
      if (name === "correoElectronico" && !/\S+@\S+\.\S+/.test(value)) {
        error = "Ingresa un correo válido.";
      }
      if (name === "telefono" && !/^\+?[0-9]{10,15}$/.test(value)) {
        error = "Ingresa un número de teléfono válido.";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          certificaciones: "Solo se aceptan archivos PDF o imágenes.",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          certificaciones: "El archivo no debe superar los 5 MB.",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, certificaciones: "" }));
      setCertifications(file);
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.keys(formData).some(
      (key) => !validateField(key, formData[key])
    );
    if (!hasErrors && certifications) {
      console.log("Form Data:", { ...formData, certifications });
      onSubmit({ ...formData, certifications }); // Pass data to the parent component
    }
  };

  return (   
      <div className="h-screen flex  flex-col w-full items-center justify-center bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-8 mt-8 md:mt-0">
        Registro de {entityType === "empresa" ? "Empresa" : "Auditor"}
      </h1>
      <form className="bg-white p-6  md:p-8 rounded gap-2 max-w-full w-full">
        {/* Dynamic Fields */}
        {entityType === "empresa" ? (
          <>
             {/* Información Básica */}
             <h2 className="text-lg md:text-xl font-bold mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="nombreEmpresa" className="block mb-2 font-bold text-sm">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  id="nombreEmpresa"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ingresa el nombre de la empresa"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paisResidencia" className="block mb-2 font-bold text-sm">
                  País de Residencia
                </label>
                <select
                  name="paisResidencia"
                  id="paisResidencia"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Seleccione un país</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="El Salvador">El Salvador</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="tipoIndustria" className="block mb-2 font-bold text-sm">
                  Tipo de Industria
                </label>
                <select
                  name="tipoIndustria"
                  id="tipoIndustria"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Seleccione una industria</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Comercio">Comercio</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="ubicacion" className="block mb-2 font-bold text-sm">
                  Ubicación
                </label>
                <textarea
                  name="ubicacion"
                  id="ubicacion"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ej. Tegucigalpa, Francisco Morazán"
                />
              </div>
              <div className="mb-8 md:col-span-2 md:w-[49%] ">
                <label htmlFor="numeroRegistro" className="block mb-2 font-bold text-sm">
                  Número de Registro de la Empresa
                </label>
                <input
                  type="text"
                  name="numeroRegistro"
                  id="numeroRegistro"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ej. 12345"
                />
              </div>
            </div>

            {/* Datos de Contacto */}
            <h2 className="text-lg font-bold mb-4">Datos de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="nombreRepresentante" className="block mb-2 font-bold text-sm">
                  Nombre de Representante
                </label>
                <input
                  type="text"
                  name="nombreRepresentante"
                  id="nombreRepresentante"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Nombre completo"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cargo" className="block mb-2 font-bold text-sm">
                  Cargo en la Empresa
                </label>
                <input
                  type="text"
                  name="cargo"
                  id="cargo"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ej. Gerente General"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="correoElectronico" className="block mb-2 font-bold text-sm">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  id="correoElectronico"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ej. ejemplo@correo.com"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="telefono" className="block mb-2 font-bold text-sm">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  name="telefono"
                  id="telefono"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Ej. +504 9876-5432"
                />
              </div>
            </div>
          </>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="nombre" className="block mb-2 font-bold text-sm">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ingresa el nombre completo"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telefono" className="block mb-2 font-bold text-sm">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                id="telefono"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ej. +504 9876-5432"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="correo" className="block mb-2 font-bold text-sm">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                id="correo"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ej. ejemplo@correo.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="pais" className="block mb-2 font-bold text-sm">
                País
              </label>
              <input
                type="text"
                name="pais"
                id="pais"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ej. Honduras"
              />
            </div>
            </div>
            <div className="mb-4">
              <label htmlFor="especializacion" className="block mb-2 font-bold text-sm">
                Especialización
              </label>
              <input
                type="text"
                name="especializacion"
                id="especializacion"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ej. Seguridad Laboral"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="certificaciones" className="block mb-2 font-bold text-sm">
                Certificaciones
              </label>
              <input
                type="file"
                name="certificaciones"
                id="certificaciones"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p className="text-xs text-gray-500 mt-2">
                Puedes subir documentos en formato PDF, DOC, o imágenes.
              </p>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
        >
          Continuar →
        </button>
      </form>
    </div>  
       
  );
};
RegisterForm.propTypes = {
  entityType: PropTypes.string.isRequired, // Must be a string and is required
  onSubmit: PropTypes.func.isRequired,    // Must be a function and is required
};
export default RegisterForm;