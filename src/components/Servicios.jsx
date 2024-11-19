import React from "react";
import aboutImg from "../assets/about.png";
// motion


const Servicios = () => {
  const servicios = [
    {
      id: 1,
      title: "Fabricants de Ropa",
      decription:
        "Nuestra plataforma permite a los fabricantes de ropa asegurar condiciones laborales éticas y rastrear la trazabilidad de sus productos.",
      image: "/src/assets/icons/membership.png",
    },
    {
      id: 2,
      title: "Empresas de Manufactura",
      decription:
        "La plataforma ayuda a las empresas de manufactura a cumplir con normativas laborales y mejorar la transparencia en su cadena de suministro",
      image: "/src/assets/icons/association.png",
    },
    {
      id: 3,
      title: "Proveedores de Insumos",
      decription:
        "Los proveedores pueden demostrar su compromiso con prácticas responsables y colaborar en una cadena de suministro ética.",
      image: "/src/assets/icons/group-club.png",
    },
  ];
  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center my-8" id="service">
     
        <h2 className="text-4xl text-neutralDGrey font-semibold mb-2">
          Nuestros Clientes
        </h2>
        <p className="text-neutralGrey">
           Empresas que Confían en Nosotros
        </p>
        <div className="my-12 flex flex-wrap justify-between items-center gap-8 ">
          <img src="src/assets/icons/company1.png" alt="" />
          <img src="src/assets/icons/company2.png" alt="" />
          <img src="src/assets/icons/company3.png" alt="" />
          <img src="src/assets/icons/company4.png" alt="" />
          <img src="src/assets/icons/company5.png" alt="" />
          <img src="src/assets/icons/company6.png" alt="" />
          <img src="src/assets/icons/company7.png" alt="" />
        </div>
     

      {/* service cards */}
      <div className="mt-20 text-center md:w-1/2 mx-auto">
      <h2 className="text-4xl text-neutralDGrey font-semibold mb-3">
        Impulsa la ética y la transparencia en cada etapa de tu negocio
        </h2>
        <p className="text-neutralGrey">
        ¿Quiénes pueden beneficiarse de nuestra plataforma?
        </p>
      
      </div>
        

      <div className="mt-14 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:w-11/12 mx-auto gap-12">     
       {servicios.map((service) => (
          <div
            key={service.id}
            className="px-4 py-8 text-center md:w-[300px] mx-auto md:h-80 rounded-md shadow cursor-pointer hover:-translate-y-5 hover:border-b-4 hover:border-indigo-700 transition-all duration-300 flex items-center justify-center h-full"
          >
            <div className="">
              <div className="bg-[#E8F5E9] w-14 h-14 mx-auto mb-4 rounded-tl-3xl rounded-br-3xl">
                <img src={service.image} alt="" className="-ml-5" />
              </div>
              <h4 className="text-2xl font-bold text-neutralDGrey mb-2 px-2">
                {service.title}
              </h4>
              <p className="text-sm text-neutralGrey">{service.decription}</p>
            </div>
          </div>
        ))}
      </div>  
      {/* Sobre Nosotros */}
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-8 " id="about">
        <div className="md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
         <div>
          <img src={aboutImg} alt="" className="w-full"/>
         </div>          
          <div className="md:w-3/5 mx-auto text-left"> 
            <h2 className="text-4xl text-neutralDGrey  font-semibold mb-4 md:w-full">
              Transparencia y Confianza para un Futuro Sostenible
            </h2>
            <p className="md:w-full text-sm text-neutralGrey mb-8 ">
            Nuestra plataforma de auditoría basada en blockchain permite a 
            las empresas cumplir con estándares internacionales de condiciones laborales, 
            proporcionando una visibilidad sin precedentes en la cadena de suministro. Gracias 
            a un sistema seguro e inmutable, tanto las empresas como los consumidores pueden confiar 
            en que la información sobre las prácticas laborales es transparente y accesible.
            </p>
            <button className="btn-primary">Saber Mas</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicios;