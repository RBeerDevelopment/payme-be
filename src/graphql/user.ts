import { booleanArg, extendType, nullable, objectType, stringArg } from "nexus";
import { Paypal } from ".";
import { AwsFileUploader } from "../aws/s3/s3-upload";
import { Context } from "../context";
import { dataSource } from "../type-orm/data-source";
import { SepaEntity, UserEntity } from "../type-orm/entities";
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
                
                return [];
                // return context.prisma.sepa.findMany({
                //     where: { userId: parent.id }
                // });
            }
        }); 
        t.nonNull.list.field("paypal", {
            type: Paypal,
            resolve(parent, args, context: Context) {

                return [];

                // return context.prisma.paypal.findMany({
                //     where: { userId: parent.id }
                // });
            }
        });
        t.nullable.string("avatarUrl", {
            async resolve(parent) {
                const user = await UserEntity.findOneByOrFail({ id: parent.id });
                const awsFileClient = new AwsFileUploader();
                if(!user?.avatarPath) {
                    return "";
                }
                return awsFileClient.createSignedUrl(user?.avatarPath);
            }
        });
        t.nonNull.list.field("payments", {
            type: Payment,
            resolve(parent, args) {

                return [];

                const { onlyActive } = args;

                // return context.prisma.payment.findMany({
                //     where: {
                //         userId: parent.id,
                //         ...(onlyActive && { isPaid: true })
                //     }                    
                // });
            }
        });
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nullable.field("users", {
            type: "User",
            resolve(parent, args, { userId }: Context) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }

                return UserEntity.find();
            },
        }),
        t.nullable.field("user", {
            type: "User",
            args: { username: stringArg(), onlyActive: nullable(booleanArg()) },
            async resolve(parent, { username }, { userId }: Context) {

                if (!userId) {
                    throw new Error("User not signed in.");
                }
                if(!username) {
                    throw new Error("No username provided.");
                }

                if(!dataSource.isInitialized) {
                    await dataSource.initialize();
                }
                return UserEntity.findOneByOrFail({ username });
            },
        })
        ;
    },
});