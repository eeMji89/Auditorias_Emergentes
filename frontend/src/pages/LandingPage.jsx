import Navbar from "../components/landing/Navbar";
import Inicio from "../components/landing/Inicio";
import Servicios from "../components/landing/Servicios";
import ContactForm from '../components/landing/ContactForm';
import Footer from '../components/landing/Footer';
function LandingPage() {

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Inicio />
      <Servicios />
      <div className="bg-gray-100">
      <ContactForm />
      </div>
      
      
      {/* Footer */}
      <Footer />
    </>
  )
}

export default LandingPage