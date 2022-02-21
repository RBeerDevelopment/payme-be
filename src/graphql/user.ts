import { extendType, objectType, stringArg } from "nexus";
import { Paypal } from ".";
import { AwsFileUploader } from "../aws/s3/s3-upload";
import { Context } from "../context";
import { Sepa } from "./sepa";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("email");
        t.nonNull.string("username");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.field("lastSignin", { type: "DateTime" });
        t.nonNull.field("createdAt", {type: "DateTime"});    
        t.nonNull.list.field("sepa", { 
            type: Sepa,
            resolve(parent, args, context: Context) {
                return context.prisma.sepa.findMany({
                    where: { userId: parent.id }
                });
            }
        }); 
        t.nonNull.list.field("paypal", {
            type: Paypal,
            resolve(parent, args, context: Context) {
                return context.prisma.paypal.findMany({
                    where: { userId: parent.id }
                });
            }
        });
        t.nullable.string("avatarUrl", {
            async resolve(parent, args, context: Context) {
                const user = await context.prisma.user.findUnique({
                    where: { id: parent.id }
                });
                const awsFileClient = new AwsFileUploader();
                if(!user?.avatarPath) {
                    return "";
                }
                return awsFileClient.createSignedUrl(user?.avatarPath);
            }
        });
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