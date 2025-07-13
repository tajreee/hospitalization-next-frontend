import { customFetch } from "@/components/utils/customFetch";
import useUserServer from "@/hooks/useUserServer";
import { ListFacilitiesResponse } from "@/modules/ListFaclities/interface";
import ListRooms from "@/modules/ListRooms";
import { ListRoomsResponse } from "@/modules/ListRooms/interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const RoomsPage = async () => {
    const user = await useUserServer();

    if (user?.role !== "nurse") {
        redirect("/dashboard");
    }

    try {
        const response = await customFetch<ListRoomsResponse>('/rooms', 
            {
                isAuthorized: true,
            },
            cookies
        );

        if (!response.success) {
            return <div>Error loading rooms.</div>;
        }

        return <ListRooms rooms={response.data.rooms} />
    } catch (error) {
        
    }
}

export default RoomsPage;