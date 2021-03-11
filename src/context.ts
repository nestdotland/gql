import { AccessToken, PrismaClient } from "@prisma/client";
import { ExpressContext, AuthenticationError, SyntaxError } from "apollo-server-express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export interface Context {
  prisma: PrismaClient;
  accessToken: AccessToken;
}

const prisma = new PrismaClient();
const pepper = process.env.PEPPER ?? "";

export async function context({ req }: ExpressContext): Promise<Context> {
  // simple auth check on every request
  const token = req.headers && req.headers.token;

  if (token === undefined)
    throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
  if (Array.isArray(token)) throw new SyntaxError("Received an array of tokens. Please provide a string.");

  const accessToken = await prisma.accessToken.findUnique({
    where: { token: crypto.createHmac("sha256", pepper).update(token).digest("base64") },
  });

  if (accessToken === null) throw new AuthenticationError("The given token is invalid.");
  return {
    accessToken,
    prisma,
  };
}
