import useUserServer from "@/hooks/useUserServer";
import { CreateRoom } from "@/modules/CreateRoom";
import { redirect } from "next/navigation";
import React from "react";

const CreateRoomPage = async () => {
    const user = await useUserServer();

    if (user?.role !== "nurse") {
        redirect("/dashboard");
    }

    return <CreateRoom />
}

export default CreateRoomPage;