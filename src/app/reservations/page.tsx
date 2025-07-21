import { customFetch } from "@/components/utils/customFetch";
import useUserServer from "@/hooks/useUserServer";
import { NurseReservations } from "@/modules/NurseReservations";
import { GetAllReservationsResponse } from "@/modules/NurseReservations/interface";
import { PatientReservations } from "@/modules/PatientReservations";
import { cookies } from "next/headers";
import React from "react";
import { toast } from "sonner";

export const ReservationsPage = async () => {
    const user = await useUserServer();

    if (user?.role === "nurse") {
        try {
            const response = await customFetch<GetAllReservationsResponse>("/reservations/nurse", 
                {
                    method: "GET",
                    isAuthorized: true,
                },
                cookies
            )

            if (!response.success) {
                toast.error("Failed to fetch nurse reservations");
                throw new Error("Failed to fetch nurse reservations");
            }

            console.log("Nurse reservations fetched successfully:", response.data.reservations);
            return <NurseReservations reservations={response.data.reservations} />;
            
        } catch (error) {
            console.error("Error fetching nurse reservations:", error);
            return <div>Error loading reservations</div>;
            
        }

    } else if (user?.role === "patient") {
        return <PatientReservations />;
    }

    return <div>Unauthorized</div>;
}

export default ReservationsPage;