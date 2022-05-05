import { PrismaClient } from "@prisma/client";
import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { getIbanInfo } from "../validation";
import { User } from "./user";

export const Sepa = objectType({
    name: "Sepa",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("iban");
        t.nonNull.string("bic");
        t.nonNull.string("bankName");
        t.nullable.string("accountName");
        t.nonNull.field("user", { 
            type: User,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            async resolve(parent, args, context : Context) {
                const sepa = await context.prisma.sepa.findUnique({
                    where: { id: parent.id },
                    include: { user: true }
                });

                return sepa?.user;
            }
        });     
    },
});


export const SepaMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("addSepa", {
            type: "Sepa",
            args: {
                iban: nonNull(stringArg()),
                accountName: nullable(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { iban, accountName } = args;

                await hasAccess(userId);

                const ibanInfo = await getIbanInfo(iban);
                if(!ibanInfo) {
                    throw new Error("Invalid IBAN.");
                }
                const sepa = await prisma.sepa.create({
                    data: {
                        iban: ibanInfo.iban,
                        bic: ibanInfo.bic,
                        bankName: ibanInfo.bankName,
                        accountName,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });

                return(sepa);
            }
        }),
        t.field("updateSepa", {
            type: "Sepa",
            args: {
                id: nonNull(intArg()),
                accountName: nullable(stringArg()),
                iban: nullable(stringArg()),
                bic: nullable(stringArg()),
                bankName: nullable(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id, accountName, iban, bic, bankName } = args;

                await hasAccess(userId, id, prisma);

                if(!iban) {
                    const newSepa = await prisma.sepa.update({
                        where: {
                            id
                        },
                        data: {
                            accountName,
                            bic: bic || undefined,
                            bankName: bankName || undefined
                        }
                    });

                    return newSepa;
                }
                
                const ibanInfo = await getIbanInfo(iban);
                if(!ibanInfo) {
                    throw new Error("Invalid IBAN.");
                }

                const newSepa = await prisma.sepa.update({
                    where: {
                        id
                    },
                    data: {
                        iban: ibanInfo.iban,
                        // check if there is a way to validate a bic
                        bic: bic ? bic : ibanInfo.bic,
                        bankName: bankName ? bankName : ibanInfo.bankName,
                        accountName
                    }
                });

                return newSepa;
            }
        }),
        t.field("deleteSepa", {
            type: "Sepa",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma, userId } = context;
                const { id } = args;

                await hasAccess(userId, id, prisma);
                
                const sepa = await prisma.sepa.delete({
                    where: { id }
                });

                return(sepa);
            }
        });

    },
});

async function hasAccess(userId: number | undefined, sepaId?: number, prisma?: PrismaClient): Promise<boolean> {

    if(!userId) {
        throw new Error("User not signed in.");
    }

    if(!sepaId) {
        return true;
    } 

    if(!prisma) {
        throw new Error("Internal Error, missing DB client");
    }

    const currentSepa = await prisma.sepa.findUnique({ where: { id: sepaId }});

    if(currentSepa?.userId !== userId) {
        throw new Error("No access to edit this SEPA account.");
    }

    return true;
                
}