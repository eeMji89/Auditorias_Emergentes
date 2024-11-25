import React from "react";
import AuditoriaTable from "./Auditorias";
import AuditoriaForm from "./AuditoriaForm";
const Homecontent= () => { 
    return (
        <div className=" h-full container flex flex-col shadow-md rounded-xl ">
            <div className="row">
                <div className="col-md-12">
                    <AuditoriaTable />

                    {/* <AuditoriaForm /> */}
                </div>
            </div>
        </div>
    );
};
export default Homecontent;