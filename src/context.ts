import { AccessToken, PrismaClient } from "@prisma/client";
import { AuthenticationError, ExpressContext, SyntaxError, ApolloError } from "apollo-server-express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { hashToken } from "./utils/token";
import { HOURLY_REQUEST_LIMIT } from "./utils/env";

export interface Context {
  prisma: PrismaClient;
  accessToken: AccessToken;
  isOwner: (name: string) => boolean;
}

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: new Redis({ enableOfflineQueue: false }),
  points: HOURLY_REQUEST_LIMIT,
  duration: 3600,
});

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
    try {
      await rateLimiterRedis.consume(req.ip);
    } catch {
      throw new ApolloError(
        `Too many requests, please try again later. (${HOURLY_REQUEST_LIMIT} req/h)`,
        "TOO_MANY_REQUESTS"
      );
    }
  }

  return {
    accessToken,
    prisma,
    isOwner(name: string) {
      return name === accessToken.ownerName;
    },
  };
}
