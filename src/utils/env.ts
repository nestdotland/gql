import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.PEPPER ?? "";
const graphqlPort = process.env.GRAPHQL_PORT ?? "";

if (pepper === "") throw new Error("Undefined environnement variable: PEPPER");
if (graphqlPort === "") throw new Error("Undefined environnement variable: GRAPHQL_PORT");

export { pepper, graphqlPort };
