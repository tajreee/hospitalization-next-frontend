import React from "react";

const NurseDashboard = () => {
    console.log("NurseDashboard component rendered");
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg">Welcome to the nurse's dashboard!</p>
        </div>
    );
};

export default NurseDashboard;