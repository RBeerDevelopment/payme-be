import { arg, booleanArg, extendType, floatArg, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { User } from "./user";
import { Currency } from "./currency";
import { PaymentRequestEntity } from "../type-orm/entities";

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
            async resolve(parent) {
                const payment = await PaymentRequestEntity.findOneOrFail({ where: { id: parent.id }, relations: ["user"] });

                return payment?.user;
            }
        });   
        t.nonNull.field("createdAt", {
            type: "DateTime",
            async resolve(parent) {

                // const payment = await context.prisma.payment.findUnique({
                //     where: { id: parent.id }
                // });

                // return payment?.createdAt;
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
            resolve(parent, args) {

                const { id } = args;
                return PaymentRequestEntity.findOneByOrFail({ id });
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
                const { userId } = context;
                const { name, description, amount, currency } = args;

                await hasAccess(userId);
                
                const payment = await PaymentRequestEntity.addPayment(name, amount, currency, userId || -1, description );

                return payment;
            }
        }),
        t.field("setPaymentPaid", {
            type: "Payment",
            args: {
                id: nonNull(intArg()),
                paid: nonNull(booleanArg())
            },
            async resolve(parent, args) {
                const { id, paid } = args;

                const payment = await PaymentRequestEntity.findOneByOrFail({ id });

                payment.isPaid = paid;

                await payment.save();

                return payment;
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
            async resolve(parent, args, { userId }: Context) {
                const { id, name, description, amount, currency } = args;

                // await hasAccess(userId, id, prisma);

                // const newPayment = await prisma.payment.update({
                //     where: {
                //         id
                //     },
                //     data: {
                //         name,
                //         description,
                //         amount,
                //         currency
                //     }
                // });

                // return newPayment;
            }
        }),
        t.field("deletePayment", {
            type: "Payment",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, { userId }: Context) {
                const { id } = args;

                await hasAccess(userId, id);
                
                const payment = await PaymentRequestEntity.findOneByOrFail({ id });

                await payment.remove();

                return payment;
            }
        });

    },
});

async function hasAccess(userId: number | undefined, paymentId?: number): Promise<boolean> {

    if(!userId) {
        throw new Error("User not signed in.");
    }

    if(!paymentId) {
        return true;
    }

    const payment = await PaymentRequestEntity.findOneByOrFail({ id: paymentId });


    if(payment?.user.id !== userId) {
        throw new Error("No access to edit this Payment.");
    }

    return true;
                
}