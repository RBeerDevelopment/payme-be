import "dotenv/config";
import { ApolloServer } from "apollo-server";

import { schema } from "./schema";
import { context } from "./context-local";

const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true
});

apolloServer.listen({ port: 3000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
