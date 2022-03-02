import { makeSchema } from "nexus";
import { NexusGraphQLSchema } from "nexus/dist/core";
import { join } from "path";

import * as types from "./graphql";



export const schema: NexusGraphQLSchema = makeSchema({
    types,
    outputs: {
        schema: join(process.cwd(), "schema.graphql"),
        typegen: join(process.cwd(), "nexus-typegen.ts"),
    },
    contextType: {
        module: join(process.cwd(), "src/context.ts"),
        export: "Context",
    }
});