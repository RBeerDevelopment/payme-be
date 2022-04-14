import { decodeAuthHeader } from "./utils";
import { ExpressContext } from "apollo-server-express";

export interface Context {
    prisma?: Record<string, string>
    userId?: number
}

export function context({ express }: { express: ExpressContext }): Context {

    const req = express.req;
    const tokenPayload =
        req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {
        prisma: {},
        userId: tokenPayload?.userId
    };
}