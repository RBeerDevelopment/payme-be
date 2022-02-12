import { extendType, objectType } from "nexus";
import { Context } from "../context";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("email");
        t.nonNull.string("username");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nullable.field("users", {
            type: "User",
            resolve(parent, args, { userId, prisma }, info) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }

                return prisma.user.findMany({});
            },
        });
    },
});