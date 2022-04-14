import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { SepaEntity } from "../type-orm/entities";
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
            async resolve(parent) {
                const sepa = await SepaEntity.findOneOrFail({ where: { id: parent.id }, relations: ["user"] });

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
            async resolve(parent, args, { userId}: Context) {

                const { iban, accountName } = args;

                await hasAccess(userId);

                const ibanInfo = await getIbanInfo(iban);
                if(!ibanInfo) {
                    throw new Error("Invalid IBAN.");
                }
                
                const paypal = await SepaEntity.addSepa(
                    iban, 
                    ibanInfo.bic, 
                    ibanInfo.bankName, 
                    userId || -1,
                    accountName
                );

                return paypal;

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
            async resolve(parent, args, { userId }: Context) {
                const { id, accountName, iban, bic, bankName } = args;

                // await hasAccess(userId, id, prisma);

                // if(!iban) {
                //     const newSepa = await prisma.sepa.update({
                //         where: {
                //             id
                //         },
                //         data: {
                //             accountName,
                //             bic,
                //             bankName
                //         }
                //     });

                //     return newSepa;
                // }
                
                // const ibanInfo = await getIbanInfo(iban);
                // if(!ibanInfo) {
                //     throw new Error("Invalid IBAN.");
                // }

                // const newSepa = await prisma.sepa.update({
                //     where: {
                //         id
                //     },
                //     data: {
                //         iban: ibanInfo.iban,
                //         // check if there is a way to validate a bic
                //         bic: bic ? bic : ibanInfo.bic,
                //         bankName: bankName ? bankName : ibanInfo.bankName,
                //         accountName
                //     }
                // });

                // return newSepa;
            }
        }),
        t.field("deleteSepa", {
            type: "Sepa",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, { userId }: Context) {
                const { id } = args;

                await hasAccess(userId, id);
                
                const sepa = await SepaEntity.findOneByOrFail({ id });

                await sepa.remove();

                return sepa;
            }
        });

    },
});

async function hasAccess(userId: number | undefined, sepaId?: number): Promise<boolean> {

    if(!userId) {
        throw new Error("User not signed in.");
    }

    if(!sepaId) {
        return true;
    } 

    // const currentSepa = await prisma.sepa.findUnique({ where: { id: sepaId }});

    // if(currentSepa?.userId !== userId) {
    //     throw new Error("No access to edit this SEPA account.");
    // }

    return true;
                
}