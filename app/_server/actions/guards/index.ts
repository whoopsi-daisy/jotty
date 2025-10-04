import { headers } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../users";

export const redirectGuards = async () => {
    const user = await getCurrentUser();
    const pathname = headers().get("x-pathname");

    if (!user && !pathname?.includes("/auth") && !pathname?.includes("/migration")) {
        redirect("/auth/login");
    }

    if (user && pathname?.includes("/auth")) {
        redirect("/");
    }
}