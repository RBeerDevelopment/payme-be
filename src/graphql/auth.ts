import { compare as bcCompare, hash as bcHash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { extendType, nonNull, objectType, stringArg } from "nexus";
import { generateAvatar, uploadAvatar } from "../avatar";
import { Context } from "../context";
import { APP_SECRET, getNowAsISO, oneHourFromNow } from "../utils";
import { validateEmailAddress, validatePassword } from "../validation";

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {

        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(parent, args, { prisma }: Context) {

                const { username, password } = args;
                const user = await prisma.user.findUnique({
                    where: { username },
                });
                
                if (!user) {
                    throw new Error("No such user found");
                }

                const valid = await bcCompare(
                    password,
                    user.passwordHash,
                );
                if (!valid) {
                    throw new Error("Invalid password");
                }

                const token = sign({ 
                    userId: user.id,
                    exp: oneHourFromNow()
                }, APP_SECRET);

                prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastSignin: getNowAsISO()
                    }
                });

                return {
                    token,
                    user,
                };
            },
        }), t.nonNull.field("signup", { // 1
            type: "AuthPayload",
            args: {
                username: nonNull(stringArg()),
                email: nonNull(stringArg()),
                firstName: nonNull(stringArg()),
                lastName: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            async resolve(parent, args, context: Context) {
                const { email, username, firstName, lastName, password } = args;

                const isValidEmail = validateEmailAddress(email);
                if (!isValidEmail) throw new Error("invalid_email");

                const isValidPassword = validatePassword(password);
                if (!isValidPassword) throw new Error("invalid_password");

                const passwordHash = await bcHash(password, 10);

                const avatar = generateAvatar(username);
                console.log({ avatar });
                const avatarFilePath = await uploadAvatar(username, avatar);
                console.log({ avatarFilePath });

                const user = await context.prisma.user.create({
                    data: {
                        email,
                        username,
                        firstName,
                        lastName,
                        passwordHash,
                        avatarPath: avatarFilePath
                    },
                });

                const token = sign({ 
                    userId: user.id,
                    exp: oneHourFromNow()
                }, APP_SECRET);
                
                return {
                    token,
                    user,
                };
            },
        });
    },
});