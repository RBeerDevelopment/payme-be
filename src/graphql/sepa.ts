import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { User } from "./user";

export const Sepa = objectType({
    name: "Sepa",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("iban");
        t.nonNull.string("bic");
        t.nonNull.string("bank");
        t.field("user", { type: User });   
    },
});


export const SepaMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("AddSepa", {
            type: "Sepa",
            args: {
                iban: nonNull(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { prisma } = context;
                const iban = { args };

                const isValidIban = validateIban(iban);
            }
        });
    }
});