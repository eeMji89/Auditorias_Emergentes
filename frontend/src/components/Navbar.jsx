import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import logo from "../assets/logo.png";
import { FaXmark, FaBars } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [user, setUser] = useState(null); // To store user info

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
      setIsMenuOpen(false);
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("https://api.example.com/user");
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUser();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { link: "Inicio", path: "inicio" },
    { link: "Servicio", path: "servicio" },
    { link: "Nuestros Clientes", path: "clientes" },
    { link: "Contactanos", path: "producto" },
    { link: "FAQ", path: "faq" },
  ];

  return (
    <header className={`bg-white fixed top-0 left-0 right-0 ${isSticky && "shadow-md"}`}>
      <nav className="py-4 px-8 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-10" />
          <span className="ml-2 text-2xl font-bold">NEXCENT</span>
        </a>
        <ul className="hidden md:flex space-x-8">
          {navItems.map(({ link, path }) => (
            <Link
              to={path}
              spy={true}
              smooth={true}
              offset={-100}
              key={link}
              className="hover:text-green-600"
            >
              {link}
            </Link>
          ))}
        </ul>
        <div className="hidden md:flex items-center space-x-4">
          <span>{user ? `Hello, ${user.name}` : "Guest"}</span>
          <a href="/login" className="text-green-500 hover:underline">
            Login
          </a>
        </div>
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="bg-gray-100 p-4">
          {navItems.map(({ link, path }) => (
            <Link key={link} to={path} spy={true} smooth={true} offset={-100}>
              {link}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
