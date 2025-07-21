import React from "react";
import { Reservation } from "./interface";

export const NurseReservations = (
    { reservations }: { reservations: Reservation[] }
) => {
    return (
        <div>
            <h1>Nurse Reservations</h1>
            {/* Nurse reservations content goes here */}
        </div>
    )
}