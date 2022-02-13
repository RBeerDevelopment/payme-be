import { extendType, objectType, stringArg } from "nexus";
import { Context } from "../context";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("email");
        t.nonNull.string("username");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.field("lastSignin", { type: "DateTime" });
        t.field("createdAt", {type: "DateTime"});     
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nullable.field("users", {
            type: "User",
            resolve(parent, args, { userId, prisma }: Context) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }

                return prisma.user.findMany({});
            },
        }),
        t.nullable.field("user", {
            type: "User",
            args: { username: stringArg() },
            resolve(parent, { username }, { userId, prisma }: Context) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }
                if(!username) {
                    throw new Error("No username provided.");
                }

                return prisma.user.findFirst({ where: { username }});
            },
        })
        ;
    },
});