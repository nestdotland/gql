import dotenv from "dotenv";

dotenv.config();

export const PEPPERS_FILE = process.env.PEPPERS_FILE ?? "./.peppers";
export const GRAPHQL_PORT = parseInt(process.env.GRAPHQL_PORT ?? "");
export const MAX_QUERY_COMPLEXITY = parseInt(process.env.MAX_QUERY_COMPLEXITY ?? "");
export const HOURLY_REQUEST_LIMIT = parseInt(process.env.HOURLY_REQUEST_LIMIT ?? "");

// fun fact: !!"" === false
if (!PEPPERS_FILE) throw new Error("Undefined environment variable: PEPPERS_FILE");
if (isNaN(GRAPHQL_PORT)) throw new Error("Undefined environnement variable: GRAPHQL_PORT");
if (isNaN(MAX_QUERY_COMPLEXITY)) throw new Error("Undefined environnement variable: MAX_QUERY_COMPLEXITY");
if (isNaN(HOURLY_REQUEST_LIMIT)) throw new Error("Undefined environnement variable: HOURLY_REQUEST_LIMIT");
