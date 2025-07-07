import useUserServer from "@/hooks/useUserServer";
import NurseDashboard from "@/modules/NurseDashboard";
import PatientDashboard from "@/modules/PatientDashboard";
import React from "react";

const DashboardPage = async () => {
    const user = await useUserServer();

    if (user?.role === "nurse") {
        return <NurseDashboard />;
        
    } else if (user?.role === "patient") {
        return <PatientDashboard />;

    } else {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg">Welcome to the dashboard!</p>
            </div>
        );
    }
};

export default DashboardPage;