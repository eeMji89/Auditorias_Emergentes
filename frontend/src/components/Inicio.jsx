import banner from "../assets/banner.png"
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-neutralSilver" id="home">
      <div className="px-4 lg:px-14 max-w-screen-2xl py-14 mx-auto min-h-full h-full flex justify-center items-center">
        <div className="w-full mx-auto">
          <div className="my-28 md:my-8 py-12 flex flex-col w-full mx-auto md:flex-row-reverse items-center justify-between gap-12">
          <div>
            <img src={banner} alt=""/>
           </div>
            {/* hero text */}
           <div className="md:w-1/2">
            <h1 className="text-5xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">Auditoría Transparente para  <span className="text-brandPrimary leading-snug">una Industria Justa</span></h1>
            <p className="text-neutralGrey text-base mb-8">Garantiza condiciones laborales justas y accesibles para todos con auditorías verificables y transparentes.</p>
            <button onClick={() => navigate("/register")}  className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey">Registrarse</button>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
