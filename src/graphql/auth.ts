import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { APP_SECRET, getNowAsISO, validateEmailAddress, validatePassword } from "../utils";

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

                const valid = await bcrypt.compare(
                    password,
                    user.passwordHash,
                );
                if (!valid) {
                    throw new Error("Invalid password");
                }

                const token = jwt.sign({ userId: user.id }, APP_SECRET);

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

                const passwordHash = await bcrypt.hash(password, 10);

                const user = await context.prisma.user.create({
                    data: {
                        email,
                        username,
                        firstName,
                        lastName,
                        passwordHash,
                    },
                });

                const token = jwt.sign({ userId: user.id }, APP_SECRET);
                return {
                    token,
                    user,
                };
            },
        });
    },
});