import { AccessToken, PrismaClient } from "@prisma/client";
import { ExpressContext, AuthenticationError, SyntaxError } from "apollo-server-express";

export interface Context {
  prisma: PrismaClient;
  accessToken: AccessToken;
}

const prisma = new PrismaClient();

export async function context({ req }: ExpressContext): Promise<Context> {
  // simple auth check on every request
  const token = req.headers && req.headers.token;

  if (token === undefined)
    throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
  if (Array.isArray(token)) throw new SyntaxError("Received an array of tokens. Please provide a string.");

  const accessToken = await prisma.accessToken.findUnique({
    where: { token },
  });

  if (accessToken === null) throw new AuthenticationError("The given token is invalid.");
  return {
    accessToken,
    prisma,
  };
}
