import React , { useState , useEffect } from "react";
import logo from '../../assets/logo.png'
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
// eslint-disable-next-line react/prop-types
const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For large screens
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
 

  return (
    <div className="min-h-screen flex bg-neutralSilver">
      <Sidebar isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={toggleMobileSidebar} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className= {` ${isMobileOpen? "hidden" : '' } static bg-green-800 py-2 shadow-md flex items-center w-full justify-between px-6`}>
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden text-white p-2 shadow-md">
            <FaBars />
          </button>
          <a href="/"className=" ml-auto text-2xl font-semibold text-white flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-8 inline-block items-center"/>
            <h1>ETHICHAIN</h1>
          </a>       
        </header>    
        
        {/* Main Content Area */}
        <main className="flex-grow min-h-screen flex items-center justify-center p-4">
          {children}
          </main>
        {/* Footer */}
        <footer className="">
          <p className="text-center text-xs bg-neutralBlack py-4 text-gray-400">
            Copyright &copy; 2023 ETHICHAIN
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;
