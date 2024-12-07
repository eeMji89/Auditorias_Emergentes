import React from "react";

import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/home/UserLayout";
import Homecontent from "../components/home/Homecontent";
import AuditoriaTable from "../components/home/Auditorias";
import AuditoriaForm from "../components/home/AuditoriaForm";
import SolicitudForm from "../components/home/SolicitudForm";
import SolicitudTable from "../components/home/Solicitudes";
import PerfilAuditor from "../components/home/PerfilAuditor";
import AuditoresDisponibles from "../components/home/AuditoresDisponibles";
import ResetPassword from "../components/home/ResetPassword";
import TerminosCondiciones from "../components/home/TerminosCond";
import SoporteContacto from "../components/home/Soporte";
import EditProfile from "../components/home/EditProfile";
import Notifications from "../components/home/Notifications";

const UserPage = () => {
    return (
        <UserLayout>           
            <Routes>
            <Route path="/" element={<Homecontent />} /> {/* Default content */}
            <Route path="auditorias" element={<AuditoriaTable />} /> {/* Auditorias table */}
            <Route path="auditorias/nueva" element={<AuditoriaForm />} /> {/* Auditoria form */}
            <Route path="solicitudes" element={<SolicitudTable />} /> {/* Auditorias table */}
            <Route path="solicitudes/nueva" element={<SolicitudForm />} /> {/* Auditoria form */}
            <Route path="solicitudes/perfil-auditor/:id" element={<PerfilAuditor/>} /> {/* Auditoria form */}
            <Route path="solicitudes/auditores-disponibles" element={<AuditoresDisponibles/>} /> {/* Auditorias table */}
            <Route path="configurar-contraseña" element={<ResetPassword/>} /> {/* Auditorias table */}
            <Route path="terminos-condiciones" element={<TerminosCondiciones/>} /> {/* Auditorias table */}
            <Route path="soporte-contacto" element={<SoporteContacto/>} /> {/* Auditorias table */}
            <Route path="perfil" element={<EditProfile/>} /> {/* Auditorias table */}
            <Route path="notificaciones" element={<Notifications/>} /> {/* Auditorias table */}
        
            </Routes>           
        </UserLayout>
    );
 };
 export default UserPage;