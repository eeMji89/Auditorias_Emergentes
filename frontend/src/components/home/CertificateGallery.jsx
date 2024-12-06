/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { FaFilePdf, FaImage } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const CertificateGallery = ({ certificates }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Certificados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition"
          >
            {certificate.preview.endsWith(".pdf") ? (
              <div className="flex flex-col items-center">
                <FaFilePdf className="text-red-500 text-4xl mb-2" />
                <a
                  href={certificate.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {certificate.name}
                </a>
              </div>
            ) : (
              <div>
                <img
                  src={certificate.preview}
                  alt={certificate.name}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-center text-gray-700 mt-2">{certificate.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateGallery;
