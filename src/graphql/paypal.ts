import { PrismaClient } from "@prisma/client";
import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { User } from "./user";

export const Paypal = objectType({
    name: "Paypal",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("username");
        t.nonNull.string("accountName");
        t.nonNull.field("user", { 
            type: User,
            async resolve(parent, args, context : Context) {
                const paypal = await context.prisma.paypal.findUnique({
                    where: { id: parent.id }
                });

                return await context.prisma.user.findUnique({
                    where: { id: paypal?.userId || -1 }
                });
            }
        });   
    },
});


export const PaypalMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("addPaypal", {
            type: "Paypal",
            args: {
                username: nonNull(stringArg()),
                accountName: nullable(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { username, accountName } = args;

                await hasAccess(userId);
                
                const paypal = await prisma.paypal.create({
                    data: {
                        username,
                        accountName,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });

                return(paypal);
            }
        }),
        t.field("updatePaypal", {
            type: "Paypal",
            args: {
                id: nonNull(intArg()),
                accountName: nullable(stringArg()),
                username: nullable(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id, accountName, username } = args;

                await hasAccess(userId, id, prisma);

                const newPaypal = await prisma.paypal.update({
                    where: {
                        id
                    },
                    data: {
                        accountName,
                        username
                    }
                });

                return newPaypal;
            }
        }),
        t.field("deletePaypal", {
            type: "Paypal",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id } = args;

                await hasAccess(userId, id, prisma);
                
                const paypal = await prisma.paypal.delete({
                    where: { id }
                });

                return(paypal);
            }
        });

    },
});

async function hasAccess(userId: number | undefined, paypalId?: number, prisma?: PrismaClient): Promise<boolean> {

    if(!userId) {
        throw new Error("User not signed in.");
    }

    if(!paypalId) {
        return true;
    } 

    if(!prisma) {
        throw new Error("Internal Error, missing DB client");
    }

    const currentPaypal = await prisma.paypal.findUnique({ where: { id: paypalId }});

    if(currentPaypal?.userId !== userId) {
        console.log({ sepaUserId: currentPaypal?.userId, userId });

        throw new Error("No access to edit this Pappal account.");
    }

    return true;
                
}