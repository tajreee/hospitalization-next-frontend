import { customFetch } from "@/components/utils/customFetch";
import useUserServer from "@/hooks/useUserServer";
import ListFacilities from "@/modules/ListFaclities";
import { ListFacilitiesResponse } from "@/modules/ListFaclities/interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const FacilitiesPage = async () => {
    const user = await useUserServer();

    if (user?.role !== "nurse") {
        redirect("/dashboard");
    }

    try {
        const response = await customFetch<ListFacilitiesResponse>('/facilities', 
            {
                isAuthorized: true,
            },
            cookies
        )

        if (!response.success) {
            return <div>Error loading facilities.</div>;
        }

        return <ListFacilities facilities={response.data.facilities} />;
    } catch (error) {
        return <div>Error loading facilities.</div>;
    }
}

export default FacilitiesPage;