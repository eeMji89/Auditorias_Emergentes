/* eslint-disable react/prop-types */
import React from "react";
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

const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen,toggleMobileSidebar }) => {
  const menuSections = [
    {
      title: "Profile",
      items: [
        { label: "Edit Profile", icon: <FaUser />, link: "/home" },
        { label: "Language", icon: <FaGlobe />, link: "/home" },
        { label: "Notifications", icon: <FaBell />, link: "/home" },
      ],
    },
    {
      title: "Auditorías",
      items: [
        { label: "Auditorías", icon: <FaFileAlt />, link: "/home/auditorias", active: true },
        { label: "Solicitudes", icon: <FaKey />, link: "/home" },
      ],
    },
    {
      title: "Seguridad",
      items: [
        { label: "Password", icon: <FaLock />, link: "/home" },
        { label: "Soporte y Contacto", icon: <FaHeadset />, link: "/home" },
        { label: "Términos y Condiciones", icon: <FaFileAlt />, link: "/home" },
      ],
    },
  ];

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
          isMobileOpen ? "translate-x-0 " : "-translate-x-full mt-12"
        } lg:translate-x-0 lg:static flex flex-col min-h-screen  ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center px-4 ${
            isOpen ? "py-3" : "py-2"
          } bg-white shadow cursor-pointer`}
          onClick={toggleSidebar}
        >
          <div className="flex gap-4 justify-center items-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
              A
            </div>
            {isOpen && <span className="font-bold">User</span>}
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
    </>
  );
};

export default Sidebar;



