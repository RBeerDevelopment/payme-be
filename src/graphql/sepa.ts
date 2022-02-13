import { extendType, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { getIbanInfo } from "../validation";
import { User } from "./user";

export const Sepa = objectType({
    name: "Sepa",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("iban");
        t.nonNull.string("bic");
        t.nonNull.string("bankName");
        t.nullable.string("accountName");
        t.field("user", { type: User });   
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

                if (!userId) {
                    throw new Error("User not signed in.");
                }

                const ibanInfo = await getIbanInfo(iban);
                if(!ibanInfo) {
                    throw new Error("Invalid IBAN.");
                }

                console.log({ ibanInfo });
                const sepa = await prisma.sepa.create({
                    data: {
                        iban: ibanInfo.iban,
                        bic: ibanInfo.bic,
                        bankName: ibanInfo.bankName,
                        accountName,
                        User: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });

                return(sepa);
            }
        });
    }
});