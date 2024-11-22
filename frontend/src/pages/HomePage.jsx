import React from "react";
import UserLayout from "../components/home/UserLayout";

const UserPage = () => {
    return (
        <UserLayout>
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Mi Perfil</h2>
                {/* User profile content */}
            </div>
        </UserLayout>
    );
 };
 export default UserPage;