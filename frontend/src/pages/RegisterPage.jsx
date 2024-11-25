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
  
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...finalData,
          Rol: entityType === "empresa" ? "Empresa" : "Auditor",
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("User registered successfully!");
        console.log("Registration successful:", data);
        // Redirect to login or another page if needed
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
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
