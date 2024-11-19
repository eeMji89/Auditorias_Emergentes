import React, { useState, useEffect } from "react";

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://api.example.com/services");
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="py-16 px-4">
      <h2 className="text-4xl text-center font-semibold">Nuestros Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {services.map(({ id, title, description }) => (
          <div key={id} className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
