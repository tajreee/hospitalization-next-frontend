import React from "react";
import { Facility } from "./interface";

const ListFacilities = ({
    data
}: {
    data: Facility[]
}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold text-fuchsia-700 mb-1">List of Facilities</h2>
            <p className="text-lg text-gray-600 mb-4">Here are the available facilities:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
            </div> 
        </div>
    )
}

export default ListFacilities;