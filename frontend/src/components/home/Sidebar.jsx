/* eslint-disable react/prop-types */
import React ,{useEffect, useState} from "react";
import {
  FaUser,
  FaBell,
  FaLock,
  FaFileAlt,
  FaHeadset,
  FaSignOutAlt,
  FaGlobe,
  FaKey,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen,toggleMobileSidebar }) => {
  const [username, setUsername] = useState();
  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("Token received:", token);

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  fetch("http://localhost:5000/userauth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("User Profile:", data);
      if (data.username) {
        setUsername(data.username);
      } else {
        console.error("Username not found in response");
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
}, []);

  const menuSections = [
    {
      title: "Profile",
      items: [
        { label: "Profile", icon: <FaUser />, link: "/home/perfil" },       
        { label: "Notifications", icon: <FaBell />, link: "/home/notificaciones" },
      ],
    },
    {
      title: "Auditorías",
      items: [
        { label: "Auditorías", icon: <FaFileAlt />, link: "/home/auditorias"},
        { label: "Solicitudes", icon: <FaKey />, link: "/home/solicitudes" },
      ],
    },
    {
      title: "Seguridad",
      items: [
        { label: "Password", icon: <FaLock />, link: "/home/configurar-contraseña" },
        { label: "Soporte y Contacto", icon: <FaHeadset />, link: "/home/soporte-contacto" },
        { label: "Términos y Condiciones", icon: <FaFileAlt />, link: "/home/terminos-condiciones" },
      ],
    },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };
  
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 bg-gray-100 shadow-lg transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0 " : "-translate-x-full"
        } lg:translate-x-0 lg:static flex flex-col min-h-screen  ${
          isOpen ? "w-64" : "w-20" }`}>
        {/* Sidebar Header */}
        <div
          className={`flex items-center px-4 ${
            isOpen ? "py-3" : "py-2"
          } bg-white shadow cursor-pointer`}
          onClick={toggleSidebar} >
          <div className="flex gap-4 justify-center items-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
              A
            </div>
            {isOpen && <span className="font-bold">{username}</span>}
          </div>
        </div>

        {/* Menu Sections */}
        <nav className="flex-grow px-4 py-6 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              {isOpen && (
                <h3 className="text-sm font-semibold text-gray-400 mb-4">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-2">
                {section.items.map(({ label, icon, link }) => (
                  <li key={label}>
                   <NavLink
                      to={link}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-green-100 text-green-600 border border-green-500"
                            : "text-gray-700 hover:bg-gray-200"
                        }`
                      }
                    >
                      <span className="text-xl">{icon}</span>
                      {isOpen && <span>{label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4">
          <button className="flex items-center w-full text-red-600 space-x-3 text-sm" onClick={handleLogout}>
            <FaSignOutAlt />
            {isOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;



