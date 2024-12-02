import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Import the Sidebar component

const AuditoriasPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-green-800 text-white py-4 px-6">
          <h1 className="text-xl font-bold">ETHICCHAIN</h1>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6">
          <h2 className="text-2xl font-bold mb-2">Auditores Disponibles</h2>
          <p className="text-gray-600 mb-6">Subheading</p>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example cards */}
            {Array(6)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex items-center space-x-4"
                >
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Auditor"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Title</h3>
                    <p className="text-gray-500">Description</p>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditoriasPage;
