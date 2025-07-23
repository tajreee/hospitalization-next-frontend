import { customFetch } from "@/components/utils/customFetch";
import useUserServer from "@/hooks/useUserServer";
import NurseDashboard from "@/modules/NurseDashboard";
import { NurseDashboardProps, NurseDashboardResponse } from "@/modules/NurseDashboard/interface";
import PatientDashboard from "@/modules/PatientDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
    const user = await useUserServer();
    
    if (!user) {
        redirect('/login');
    }

    if (user?.role === "nurse") {
        try {
            const response = await customFetch<NurseDashboardResponse>('/dashboard',
                {
                    isAuthorized: true,
                },
                cookies
            )

            if (!response.success) {
                if (response.status === 429) {
                    return <div>Too many requests. Please try again later.</div>;
                }

                console.error("Failed to fetch nurse dashboard data:", response.message);
                return <div>Error loading nurse dashboard.</div>;
            }



            return <NurseDashboard data={response.data} />;
        } catch (error) {
            console.error("Error fetching nurse dashboard data:", error);
            return <div>Error loading nurse dashboard.</div>;
        }
        
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