/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Payment as PrismaPayment, User as PrismaUser } from "@prisma/client";
import { booleanArg, extendType, nullable, objectType, stringArg } from "nexus";
import { Paypal } from ".";
import { AwsFileUploader } from "../aws/s3/s3-upload";
import { Context } from "../context";
import { Payment } from "./payment";
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
                    where: { userId: parseInt(parent.id) }
                });
            }
        }); 
        t.nonNull.list.field("paypal", {
            type: Paypal,
            resolve(parent, args, context: Context) {
                return context.prisma.paypal.findMany({
                    where: { userId: parseInt(parent.id) }
                });
            }
        });
        t.nullable.string("avatarUrl", { async resolve(parent, args, context: Context) {
            const user = await context.prisma.user.findUnique({
                where: { id: parseInt(parent.id) }
            });
            const awsFileClient = new AwsFileUploader();
            if(!user?.avatarPath) {
                return "";
            }
            return await awsFileClient.createSignedUrl(user?.avatarPath) || "";
        }
        });
        t.nonNull.list.field("payments", {
            type: Payment,
            // @ts-ignore
            async resolve(parent, { onlyActive }, context: Context): Promise<PrismaPayment[]> {


                const payments = await context.prisma.payment.findMany({
                    where: {
                        userId: parent.id,
                        ...(onlyActive && { isPaid: true })
                    }                    
                });

                return payments || [];
            }
        });
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nullable.field("users", {
            type: "User",
            // @ts-ignore
            resolve(parent, args, { userId, prisma }: Context) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }

                return prisma.user.findMany({});
            },
        }),
        t.nullable.field("user", {
            type: "User",
            args: { username: stringArg(), onlyActive: nullable(booleanArg()) },
            // @ts-ignore
            async resolve(parent, args, ctx) {

                const { username } = args;
                const { userId, prisma } = ctx;

                if (!userId) {
                    throw new Error("User not signed in.");
                }
                if(!username) {
                    throw new Error("No username provided.");
                }

                return await prisma.user.findFirst({ where: { username }});
            },
        })
        ;
    },
});