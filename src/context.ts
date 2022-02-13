import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils";
import { ExpressContext } from "apollo-server-express";

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient
    userId?: number
}

export function context({ express }: { express: ExpressContext }): Context {

    const req = express.req;
    const token =
        req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {
        prisma,
        userId: token?.userId
    };
}