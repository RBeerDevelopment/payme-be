import { enumType } from "nexus";


export const Currency = enumType({
    name: "Currency",
    members: ["USD", "GBP", "EUR", "AUD", "JPY", "CNY"],
    description: "Available currencies according to ISO 4217",
});