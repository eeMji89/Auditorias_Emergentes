import React from "react";
import AuditoriaTable from "./Auditorias";
import AuditoriaForm from "./AuditoriaForm";
const Homecontent= () => { 
    return (
        <div className=" h-full container flex flex-col shadow-md rounded-xl ">
            <div className="row items-center justify-center">
                <div className="col-md-12 items-center justify-center">
                    <AuditoriaTable />

                    {/* <AuditoriaForm /> */}
                </div>
            </div>
        </div>
    );
};
export default Homecontent;