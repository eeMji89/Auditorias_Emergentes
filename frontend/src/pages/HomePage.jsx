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
import ResetPasswordForm from "../components/home/ResetPassword";
import TerminosCondiciones from "../components/home/TerminosCond";
import SoporteContacto from "../components/home/Soporte";
import UserProfile from "../components/home/EditProfile";
import Notifications from "../components/home/Notifications";
import SolicitudDetail from "../components/home/DetallesSolicitud";
import AuditoriaDetail from "../components/home/DetallesAuditoria";
import Contrato from "../components/home/Contrato";
const UserPage = () => {
    return (
        <UserLayout>           
            <Routes>
            <Route path="/" element={<Homecontent />} /> {/* Default content */}
            <Route path="auditorias" element={<AuditoriaTable />} /> 
            <Route path="auditorias/nueva" element={<AuditoriaForm />} /> 
            <Route path="solicitudes" element={<SolicitudTable />} /> 
            <Route path="solicitudes/nueva" element={<SolicitudForm />} /> 
            <Route path="solicitudes/perfil-auditor/:id" element={<PerfilAuditor/>} /> 
            <Route path="solicitudes/auditores-disponibles" element={<AuditoresDisponibles/>} /> 
            <Route path="solicitudes/detalles/:id" element={<SolicitudDetail/>} />
            <Route path="auditorias/detalles/:id" element={<AuditoriaDetail/>} />  
            <Route path="configurar-contraseña" element={<ResetPasswordForm/>} /> 
            <Route path="terminos-condiciones" element={<TerminosCondiciones/>} /> 
            <Route path="soporte-contacto" element={<SoporteContacto/>} /> 
            <Route path="perfilUsuario" element={<UserProfile/>} /> 
            <Route path="notificaciones" element={<Notifications/>} />  
            <Route path="auditorias/contrato" element={<Contrato />} />     
            </Routes>           
        </UserLayout>
    );
 };
 export default UserPage;