import React , { useState } from "react";
import logo from '../../assets/logo.png'
import Sidebar from "./Sidebar";
// eslint-disable-next-line react/prop-types
const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-neutralSilver">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-shadeS5 py-2 shadow-md flex items-center justify-between px-6">
          <a href="/"className=" ml-auto text-2xl font-semibold text-white flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-8 inline-block items-center"/>
            <h1>ETHICHAIN</h1>
          </a>       
        </header>    
        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center p-4">
          {children}
          </main>
        {/* Footer */}
        <footer>
          <p className="text-center text-xs bg-neutralBlack py-4 text-gray-400">
            Copyright &copy; 2023 ETHICHAIN
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;
