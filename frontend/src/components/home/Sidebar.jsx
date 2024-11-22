/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  FaUser,FaBell, FaLock, FaFileAlt, FaHeadset, FaSignOutAlt, FaGlobe, FaKey, FaBars,} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State for mobile sidebar

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const menuSections = [
    {
      title: "Profile",
      items: [
        { label: "Edit Profile", icon: <FaUser />, link: "/profile" },
        { label: "Language", icon: <FaGlobe />, link: "/language" },
        { label: "Notifications", icon: <FaBell />, link: "/notifications" },
      ],
    },
    {
      title: "Auditorías",
      items: [
        { label: "Auditorías", icon: <FaFileAlt />, link: "/auditorias", active: true },
        { label: "Solicitudes", icon: <FaKey />, link: "/solicitudes" },
      ],
    },
    {
      title: "Seguridad",
      items: [
        { label: "Password", icon: <FaLock />, link: "/password" },
        { label: "Soporte y Contacto", icon: <FaHeadset />, link: "/support" },
        { label: "Términos y Condiciones", icon: <FaFileAlt />, link: "/terms" },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar for large screens */}
      
      <div
        className={`hidden lg:flex flex-col h-screen bg-gray-100 shadow-lg ${
          isOpen ? "w-64" : "w-20"} transition-all duration-300`}>
        {/* Sidebar Header */}
        <div
          className={`flex items-center justify-between px-4 ${
            isOpen ? "py-3" : "py-2 bg-shadeS5"} py-2 bg-white shadow`}>
          <button
            onClick={toggleSidebar}
            className="focus:outline-none text-green-600">
            {isOpen ? (
              <span className="font-bold">User</span>
            ) : (
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                A
              </div>
            )}
          </button>
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
                {section.items.map(({ label, icon, link, active }) => (
                  <li key={label}>
                    <a
                      href={link}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                        active
                          ? "bg-green-100 text-green-600 border border-green-500"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      {isOpen && <span>{label}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4">
          <button className="flex items-center w-full text-red-600 space-x-3 text-sm">
            <FaSignOutAlt />
            {isOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Sidebar for mobile screens */}
      <button
        className="lg:hidden bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center fixed top-4 left-4 z-50"
        onClick={handleMobileToggle}
      >
        {isMobileOpen ? <FaBars /> : <FaUser />}
      </button>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleMobileToggle}>
          <div
            className={`absolute top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transition-all duration-300`}
          >
            <nav className="px-4 py-6 space-y-6">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-400 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map(({ label, icon, link, active }) => (
                      <li key={label}>
                        <a
                          href={link}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                            active
                              ? "bg-green-100 text-green-600 border border-green-500"
                              : "text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <span className="text-xl">{icon}</span>
                          <span>{label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="px-4 py-4">
              <button className="flex items-center w-full text-red-600 space-x-3 text-sm">
                <FaSignOutAlt />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
