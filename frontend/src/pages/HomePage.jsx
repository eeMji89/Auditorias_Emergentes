import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/home/UserLayout";
import Homecontent from "../components/home/Homecontent";
import AuditoriaTable from "../components/home/Auditorias";
import AuditoriaForm from "../components/home/AuditoriaForm";

const UserPage = () => {
    return (
        <UserLayout>           
            <Routes>
            <Route path="/" element={<Homecontent />} /> {/* Default content */}
            <Route path="auditorias" element={<AuditoriaTable />} /> {/* Auditorias table */}
            <Route path="auditorias/nueva" element={<AuditoriaForm />} /> {/* Auditoria form */}
            </Routes>           
        </UserLayout>
    );
 };
 export default UserPage;