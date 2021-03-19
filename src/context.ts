import { AccessToken, PrismaClient } from "@prisma/client";
import { ApolloError, AuthenticationError, ExpressContext, SyntaxError } from "apollo-server-express";
import { hashToken } from "./utils/token";
import { HOURLY_REQUEST_LIMIT } from "./utils/env";

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

  // no request limit for rest api
  if (accessToken.ownerName !== "nestdotland") {
    const user = await prisma.user.findUnique({
      where: {
        name: accessToken.ownerName,
      },
    });
    if (user === null) {
      throw new Error("User doesn't exist. Please report this bug.");
    }
    const now = new Date().getTime();
    const oneHourAgo = now - 3_600_000;
    const newLogs = user.logs.filter((time) => time > oneHourAgo);
    if (newLogs.length > HOURLY_REQUEST_LIMIT) {
      throw new ApolloError(
        `Too many requests, please try again later. (${HOURLY_REQUEST_LIMIT} req/h)`,
        "TOO_MANY_REQUESTS"
      );
    }
    newLogs.push(now);
    await prisma.user.update({
      where: {
        name: accessToken.ownerName,
      },
      data: {
        logs: newLogs,
      },
    });
  }

  return {
    accessToken,
    prisma,
    isOwner(name: string) {
      return name === accessToken.ownerName;
    },
  };
}
