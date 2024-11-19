import Navbar from "../components/Navbar";
import Inicio from "../components/Inicio";
import Servicios from "../components/Servicios";
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
function LandingPage() {

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Inicio />
      <Servicios />
      <ContactForm />
      
      {/* Footer */}
      <Footer />
    </>
  )
}

export default LandingPage