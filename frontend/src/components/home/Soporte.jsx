import React from "react";
import ContactForm from "../landing/ContactForm"

const SoporteContacto = () => {
  return (
    <div className="soporte-contacto max-w-screen w-11/12 mx-auto bg-white
     shadow-md rounded-lg overflow-hidden p-6 md:p-12">
      <h1 className="text-lg font-semibold mb-3 mt-3">¿Necesitas Ayuda?</h1>
      <p className="text-justify">
        Estamos aquí para asistirte. Si tienes alguna pregunta o necesitas ayuda
        con nuestra plataforma, puedes ponerte en contacto con nosotros a través
        de las siguientes opciones:
      </p>

      <h2 className=" text-md font-semibold mb-3 mt-3">Formulario de Contacto</h2>
      <ContactForm className="w-11/12"/>     
      <h2 className="mb-2 text-lg font-semibold mb-3 mt-3">Preguntas Frecuentes (FAQ)</h2>
      <ul>
        <div className="flex-col text-justify gap-4">
        <li>
          <strong>¿Qué es blockchain y cómo lo utiliza esta plataforma?</strong>
          <p>
            Blockchain es una tecnología que asegura la inmutabilidad y
            transparencia de los registros. En nuestra plataforma, se utiliza
            para verificar y almacenar auditorías de manera segura.
          </p>
        </li>
        <li>
          <strong>¿Cómo registro una auditoría?</strong>
          <p>
            Un auditor autorizado puede ingresar los datos de la auditoría en la
            plataforma y verificar los resultados a través de blockchain.
          </p>
        </li>
        <li>
          <strong>¿Cómo verifico una auditoría en blockchain?</strong>
          <p>
            Cada auditoría incluye un hash de transacción que puedes consultar
            en un explorador de blockchain como Etherscan.
          </p>
        </li>
        </div>
      </ul>
        
      <h2 className="mb-2 text-lg font-semibold mb-3 mt-3">Información de Contacto</h2>
      <p>
        <strong>Correo Electrónico:</strong> soporte@ethichain.com
        <br />
        <strong>Teléfono:</strong> +(000) 0000-0000
        <br />
        <strong>Horario de Atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
        (GMT-6)
      </p>
    </div>
  );
};

export default SoporteContacto;
