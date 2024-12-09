import React from "react";

const TerminosCondiciones = () => {
  return (
    <div className="terminos-condicione soporte-contacto max-w-screen w-11/12 mx-auto
     bg-white shadow-md rounded-lg overflow-hidden p-12 text-justify">
      <h1 className="text-lg font-semibold mb-3 mt-3">Términos y Condiciones</h1>
      <p>
        Este documento establece los términos y condiciones para el uso de
        nuestra plataforma. Al registrarte o utilizar nuestros servicios,
        aceptas cumplir con estos términos.
      </p>

      <h2 className="text-lg font-semibold mb-3 mt-3">Uso de la Plataforma</h2>
      <div className="flex flex-col py-2 gap-2">   
      <ul>
        <li>
          <strong>Veracidad de los Datos:</strong> Los usuarios deben ingresar
          información precisa y verídica.
        </li>
        <li>
          <strong>Restricciones de Uso:</strong>
          <ul>
            <li>No está permitido el uso indebido de la plataforma.</li>
            <li>
              El acceso está limitado a usuarios autorizados (auditores,
              empresas y consumidores).
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="font-semibold mb-3 mt-3">Propiedad Intelectual</h2>
      <p>
        Todos los textos, gráficos, logotipos y software son propiedad de
        [Nombre de la Plataforma]. Queda prohibido copiar, distribuir o
        modificar estos materiales sin autorización previa.
      </p>

      <h2 className="font-semibold mb-3 mt-3">Privacidad y Tratamiento de Datos</h2>
      <ul>
        <li>
          <strong>Datos Recopilados:</strong> Nombre, correo electrónico, datos
          de auditorías y otros relacionados con el uso de la plataforma.
        </li>
        <li>
          <strong>Uso de los Datos:</strong> Los datos se utilizan para mejorar
          los servicios, realizar análisis y garantizar el cumplimiento
          normativo.
        </li>
        <li>
          <strong>Protección de Datos:</strong> Cumplimos con normativas
          internacionales como GDPR para garantizar la privacidad de tus datos.
        </li>
      </ul>

      <h2 className="font-semibold mb-3 mt-3">Registro en Blockchain</h2>
      <p>
        Los datos registrados en blockchain son inmutables y no pueden ser
        eliminados ni modificados. Cada auditoría incluye un hash de transacción
        para verificación en exploradores de blockchain.
      </p>

      <h2 className="font-semibold mb-3 mt-3">Limitación de Responsabilidad</h2>
      <p>
        La plataforma no se hace responsable de errores cometidos por auditores
        o empresas al ingresar datos. El uso de los datos verificados en
        blockchain es responsabilidad exclusiva del usuario.
      </p>
     </div>
      <h2 className="font-semibold mb-3 mt-3">Condiciones de Uso</h2>
      <p>
        Los usuarios no pueden intentar acceder a cuentas de otros usuarios,
        usar la plataforma para actividades ilegales o manipular los datos
        registrados.
      </p>

      <h2 className="font-semibold mb-3 mt-3">Actualizaciones de los Términos</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier
        momento. Los usuarios serán notificados de cualquier cambio importante.
      </p>

      <h2 className="font-semibold mb-3 mt-3">Contacto</h2>
      <p>
        Si tienes alguna pregunta sobre estos términos y condiciones, contáctanos
        en soporte@nombredelaplataforma.com.
      </p>
    </div>
  );
};

export default TerminosCondiciones;
