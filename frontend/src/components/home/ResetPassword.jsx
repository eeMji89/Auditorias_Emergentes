import React, { useState, useEffect } from "react";
import { updatePassword, fetchUserProfile } from "../../api/auth";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserProfile();
        setUsername(response.data.username); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error al cargar los datos del usuario.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }
      await updatePassword(payload);
      toast.success("Contraseña actualizada exitosamente.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center md:w-9/12 w-11/12 justify-center h-screen ">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Cambiar Contraseña
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              readOnly
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Contraseña Actual
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-medium bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

