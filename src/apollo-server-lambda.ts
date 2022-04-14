import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground as Playground } from "apollo-server-core";

import "reflect-metadata";
import { dataSource } from "./type-orm/data-source";

import { schema } from "./schema";
import { context } from "./context";

// dataSource.initialize().then(() => { 
//     return;
// });

const isOffline = Boolean(process.env.IS_OFFLINE);

const plugins = [];

if(isOffline) {
    plugins.push(Playground());
}
const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: isOffline,
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
