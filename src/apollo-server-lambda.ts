import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground as Playground } from "apollo-server-core";

import { schema } from "./schema";
import { context } from "./context";

const isOffline = process.env.IS_OFFLINE;

const plugins = [];

if(isOffline) {
    plugins.push(Playground());
}
const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true,
    plugins
});

export const graphqlHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: "*",
            credentials: true
        }
    }
});
