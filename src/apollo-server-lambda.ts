import { ApolloServer } from "apollo-server-lambda";

import { schema } from "./schema";
import { context } from "./context";

const mySchema: any = schema;

const apolloServer = new ApolloServer({
    schema: mySchema,
    context,
    introspection: true
});

export const graphqlHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: "*",
            credentials: true
        }
    }
});
