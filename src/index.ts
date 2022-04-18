import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { schema } from "./schema";
import { context } from "./context";
import "dotenv/config";

const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const port = process.env.PORT || 3000;

apolloServer.listen({ port }).then(({ url }) => {
    console.log(`🚀  Server  ready at ${url}`);
});
