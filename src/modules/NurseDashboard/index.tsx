import React from "react";
import { NurseDashboardProps } from "./interface";

const NurseDashboard = ({ 
    data
}: { 
    data: NurseDashboardProps
}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl font-bold text-fuchsia-700 text-center">Hospitalization Service</h1>
            <p className="text-lg text-gray-600 mt-4">Welcome to the nurse's dashboard!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-white border-fuchsia-700 border-2 shadow-md rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                        <h2 className="text-7xl font-bold text-fuchsia-700">{data.total_patients}</h2>
                    </div>
                    <h5 className="text-1xl font-semibold text-fuchsia-800">Patient Reserved</h5>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-white border-fuchsia-700 border-2 shadow-md rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                        <h2 className="text-7xl font-bold text-fuchsia-700">{data.total_rooms}</h2>
                    </div>
                    <h5 className="text-1xl font-semibold text-fuchsia-800">Room Created</h5>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-white border-fuchsia-700 border-2 shadow-md rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                        <h2 className="text-7xl font-bold text-fuchsia-700">{data.total_reservations}</h2>
                    </div>
                    <h5 className="text-1xl font-semibold text-fuchsia-800">Reservation Created</h5>
                </div>

            </div>
        </div>
    );
};

export default NurseDashboard;