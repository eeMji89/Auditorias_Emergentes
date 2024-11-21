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

  const handleCompleteSubmit = (credentials) => {
    const finalData = { ...formData, ...credentials };
    console.log("Final Registration Data:", finalData);
    // Call your API here to save finalData
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
