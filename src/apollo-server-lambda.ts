import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { schema } from "./schema";
import { context } from "./context";

const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const graphqlHandler = apolloServer.createHandler({});
