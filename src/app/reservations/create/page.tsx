import useUserServer from "@/hooks/useUserServer";
import { CreateReservation } from "@/modules/CreateReservation";
import { redirect } from "next/navigation";
import React from "react";

export const CreateReservationPage = async () => {
    const user = await useUserServer();

    if (user?.role !== "nurse" ) {
        redirect("/dashboard");
    }

    return <CreateReservation nurseId={user.id} />;
}

export default CreateReservationPage;