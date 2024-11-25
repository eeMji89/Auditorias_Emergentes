import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/home/UserLayout";
import Homecontent from "../components/home/Homecontent";
import AuditoriaTable from "../components/home/Auditorias";
import AuditoriaForm from "../components/home/AuditoriaForm";
import SolicitudForm from "../components/home/SolicitudForm";
import SolicitudTable from "../components/home/Solicitudes";

const UserPage = () => {
    return (
        <UserLayout>           
            <Routes>
            <Route path="/" element={<Homecontent />} /> {/* Default content */}
            <Route path="auditorias" element={<AuditoriaTable />} /> {/* Auditorias table */}
            <Route path="auditorias/nueva" element={<AuditoriaForm />} /> {/* Auditoria form */}
            <Route path="solicitudes" element={<SolicitudTable />} /> {/* Auditorias table */}
            <Route path="solicitudes/nueva" element={<SolicitudForm />} /> {/* Auditoria form */}
            </Routes>           
        </UserLayout>
    );
 };
 export default UserPage;