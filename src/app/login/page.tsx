import useUserServer from "@/hooks/useUserServer";
import LoginModule from "@/modules/LoginModule";
import { redirect } from "next/navigation";
import React from "react";

const LoginPage = async () => {
    const user = await useUserServer();

    if (user) {
        // redirect("/dashboard");
    }
    return <LoginModule />;
}

export default LoginPage;