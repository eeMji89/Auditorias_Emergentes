/* eslint-disable react/prop-types */
import React, { useState } from "react";

const EditProfile = ({ auditor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(auditor);
  
    const toggleEditing = () => setIsEditing(!isEditing);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSave = () => {
      console.log("Updated Profile Data:", formData);
      setIsEditing(false);
    };
  
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-6 bg-green-800 text-white">
          <h1 className="text-2xl font-bold">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white text-black p-2 rounded"
              />
            ) : (
              formData.name
            )}
          </h1>
        </div>
        <div className="p-6">
          <h2>Email</h2>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p>{formData.email}</p>
          )}
          <button
            onClick={isEditing ? handleSave : toggleEditing}
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            {isEditing ? "Guardar" : "Editar"}
          </button>
        </div>
      </div>
    );
};

export default EditProfile;