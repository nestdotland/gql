import { AccessToken, PrismaClient } from "@prisma/client";
import { AuthenticationError, ExpressContext, SyntaxError } from "apollo-server-express";
import { hashToken } from "./utils/token";

export interface Context {
  prisma: PrismaClient;
  accessToken: AccessToken;
  isOwner: (name: string) => boolean;
}

const prisma = new PrismaClient();

export async function context({ req }: ExpressContext): Promise<Context> {
  // simple auth check on every request
  const token = req.headers && req.headers.token;

  if (token === undefined) {
    throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
  }
  if (Array.isArray(token)) {
    throw new SyntaxError("Received an array of tokens. Please provide a string.");
  }

  const accessToken = await prisma.accessToken.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
  });

  if (accessToken === null) {
    throw new AuthenticationError("The given token is invalid.");
  }
  return {
    accessToken,
    prisma,
    isOwner(name: string) {
      return name === accessToken.ownerName;
    },
  };
}
