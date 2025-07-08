import useUserServer from "@/hooks/useUserServer";
import CreateFacility from "@/modules/CreateFacility";
import { redirect } from "next/navigation";
import React from "react";

const CreateFacilityPage = async () => {
    const user = await useUserServer();

    if (user?.role !== "nurse") {
        redirect("/dashboard");
    }

    return <CreateFacility />
}

export default CreateFacilityPage;