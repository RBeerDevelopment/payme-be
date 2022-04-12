import { PrismaClient } from "@prisma/client";
import { arg, extendType, floatArg, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { User } from "./user";
import { Currency } from "./currency";

export const Payment = objectType({
    name: "Payment",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nullable.string("description");
        t.nonNull.float("amount");
        // may have to be handled
        t.nonNull.string("currency");
        t.nonNull.boolean("isPaid");
        t.nonNull.field("createdBy", { 
            type: User,
            async resolve(parent, args, context: Context) {
                const payment = await context.prisma.payment.findUnique({
                    where: { id: parent.id },
                    include: { createdBy: true }
                });

                return payment?.createdBy;
            }
        });   
        t.nonNull.field("createdAt", {
            type: "DateTime",
            async resolve(parent, args, context: Context) {
                const payment = await context.prisma.payment.findUnique({
                    where: { id: parent.id }
                });

                return payment?.createdAt;
            }
        });
    },
});


export const PaymentQuery = extendType({
    type: "Query",
    definition(t) {
        t.nullable.field("payment", {
            type: "Payment",
            args: { id: intArg() },
            resolve(parent, args, { prisma }: Context) {

                const { id } = args;
                return prisma.payment.findUnique({ where: { id }});
            },
        });
    },
});


export const PaymentMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("addPayment", {
            type: "Payment",
            args: {
                name: nonNull(stringArg()),
                description: nullable(stringArg()),
                amount: nonNull(floatArg()),
                currency: nonNull(arg({
                    type: Currency,
                }))
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { name, description, amount, currency } = args;

                await hasAccess(userId);
                
                const payment = await prisma.payment.create({
                    data: {
                        name,
                        description,
                        amount,
                        currency,
                        createdBy: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });

                return payment;
            }
        }),
        t.field("markPaymentPaid", {
            type: "Payment",
            args: {
                id: nonNull(intArg()),
            },
            async resolve(parent, args, context: Context) {
                const { prisma } = context;
                const { id } = args;

                const newPayment = await prisma.payment.update({
                    where: {
                        id
                    },
                    data: {
                        isPaid: true
                    }
                });

                return newPayment;
            }
        }),
        t.field("updatePayment", {
            type: "Paypal",
            args: {
                id: nonNull(intArg()),
                name: nullable(stringArg()),
                description: nullable(stringArg()),
                amount: nullable(stringArg()),
                currency: nonNull(arg({
                    type: Currency,
                }))
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id, name, description, amount, currency } = args;

                await hasAccess(userId, id, prisma);

                const newPayment = await prisma.payment.update({
                    where: {
                        id
                    },
                    data: {
                        name,
                        description,
                        amount,
                        currency
                    }
                });

                return newPayment;
            }
        }),
        t.field("deletePayment", {
            type: "Payment",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id } = args;

                await hasAccess(userId, id, prisma);
                
                const payment = await prisma.payment.delete({
                    where: { id }
                });

                return(payment);
            }
        });

    },
});

async function hasAccess(userId: number | undefined, paymentId?: number, prisma?: PrismaClient): Promise<boolean> {

    if(!userId) {
        throw new Error("User not signed in.");
    }

    if(!paymentId) {
        return true;
    } 

    if(!prisma) {
        throw new Error("Internal Error, missing DB client");
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId }});

    if(payment?.userId !== userId) {
        throw new Error("No access to edit this Payment.");
    }

    return true;
                
}