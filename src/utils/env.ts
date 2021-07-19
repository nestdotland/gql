import dotenv from "dotenv";

dotenv.config();

export const PEPPER = process.env.PEPPER ?? "";
export const GRAPHQL_PORT = parseInt(process.env.GRAPHQL_PORT ?? "");

if (PEPPER === "") throw new Error("Undefined environnement variable: PEPPER");
if (isNaN(GRAPHQL_PORT)) throw new Error("Undefined environnement variable: GRAPHQL_PORT");
