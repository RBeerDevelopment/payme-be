import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils";
import { Request } from "express";
export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient
    userId?: number
}

export function context({req}: {req: Request }): Context {


    const tokenPayload =
        req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {
        prisma,
        userId: tokenPayload?.userId
    };
}