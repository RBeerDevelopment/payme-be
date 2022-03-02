import { verify } from "jsonwebtoken";


export const APP_SECRET: string = process.env.APP_SECRET || "";

export interface AuthTokenPayload {
    userId: number
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload {

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        throw new Error("No token found");
    }
    
    return verify(token, APP_SECRET, { maxAge: "1 hour"}) as AuthTokenPayload;

}