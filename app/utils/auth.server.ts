import { redirect } from "react-router";
import { decodeJwt } from "jose";

export async function requireAuth(request: Request) {
    const cookieHeader = request.headers.get("Cookie") || "";

    const token = cookieHeader
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    if (!token) {
        throw redirect("/signin?expired=true");
    }

    try {
        const payload = decodeJwt(token);

        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
            throw redirect("/signin?expired=true");
        }

        return { authenticated: true, user: payload };
    } catch (error) {
        throw redirect("/signin?expired=true");
    }
}