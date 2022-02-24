import { GraphQLDateTime } from "./isodate";
import { asNexusMethod } from "nexus";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, "datetime");