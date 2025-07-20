import useUserServer from "@/hooks/useUserServer";
import { NurseReservations } from "@/modules/NurseReservations";
import { PatientReservations } from "@/modules/PatientReservations";
import React from "react";

export const ReservationsPage = async () => {
    const user = await useUserServer();

    if (user?.role === "nurse") {
        return <NurseReservations />;

    } else if (user?.role === "patient") {
        return <PatientReservations />;
    }

    return <div>Unauthorized</div>;
}

export default ReservationsPage;