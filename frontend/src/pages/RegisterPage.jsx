import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import RegisterChoice from "../components/RegisterChoser";
import RegisterComplete from "../components/RegisterComplete";
import AuthLayout from "../components/AuthLayout";


const RegisterPage = () => {
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({});
  const [entityType, setEntityType] = useState(""); 


  const handleFormSubmit = (data) => {
    setFormData(data);
    setStep(2); // Move to the next step
  };
  const handleEntitySelect = (type) => {
    setEntityType(type); // Set selected entity ("empresa" or "auditor")
    setStep(1); // Move to step 1: RegisterForm
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
          formDataToSend.append("Certificaciones", file);
        });
      }
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formDataToSend
      });
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text(); // Fallback for non-JSON responses
      }
      if (response.ok) {
        alert("User registered successfully!");
        console.log("Registration successful:", responseData);
        // Redirect to login or another page if needed
      } else {
        console.error("Registration failed:", responseData);
        alert(`Registration failed: ${responseData.error || responseData}`);
      }
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
