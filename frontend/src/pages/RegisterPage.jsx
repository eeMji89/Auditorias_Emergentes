import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import RegisterChoice from "../components/RegisterChoser";
import RegisterComplete from "../components/RegisterComplete";
import AuthLayout from "../components/AuthLayout";
import { register } from "../api/auth";


const RegisterPage = () => {
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({});
  const [entityType, setEntityType] = useState(""); 


  const handleFormSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2); 
  };
  const handleEntitySelect = (type) => {
    setEntityType(type); // Set selected entity ("empresa" or "auditor")
    setStep(1); 
  };

  const handleCompleteSubmit = async (credentials) => {
    const finalData = { ...formData, ...credentials };
    console.log("Payload being sent:", {
          ...finalData,
          Rol: entityType === "empresa" ? "Empresa" : "Auditor",
        });

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.entries(finalData).forEach(([key, value]) => {
        if (key !== "Certificaciones") {
          formDataToSend.append(key, value);
        }
      });  
      formDataToSend.append("Rol", entityType === "empresa" ? "Empresa" : "Auditor");

      // Append files for Certificaciones (if present)
      if (entityType === "auditor" && finalData.Certificaciones) {
        finalData.Certificaciones.forEach((file) => {
          console.log(file);
          formDataToSend.append("Certificaciones", file);
        });
      }
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      const response = await register (formDataToSend);      
        console.log("Registration successful:",response.data);
        alert("User registered successfully!");
    
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Ocurrió un error. Inténtalo de nuevo.");
    }
  };
  

  return (
    <AuthLayout>
      {step === 0 && <RegisterChoice onSelect={handleEntitySelect} />} {/* RegisterChooser */}
      {step === 1 && (
        <RegisterForm entityType={entityType} onSubmit={handleFormSubmit} />
      )} {/* RegisterForm */}
      {step === 2 && <RegisterComplete onSubmit={handleCompleteSubmit} />} {/* RegisterComplete */}
    </AuthLayout>
  );
};

export default RegisterPage;
