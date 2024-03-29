import { AccessToken, Prisma, PrismaClient, UsageQuotaApi } from "@prisma/client";
import { ApolloError, AuthenticationError, ExpressContext, SyntaxError } from "apollo-server-express";
import { hashToken } from "./utils/token";
import { Permissions } from "./utils/permission";

export interface Context {
  prisma: PrismaClient;
  username: string;
  permissions: Permissions;
  accessToken: AccessToken;
  quota: UsageQuotaApi;
}

const prisma = new PrismaClient();

/** Auth check on every request */
export async function context({ req }: ExpressContext): Promise<Context> {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
  }
  if (!authorization.startsWith("Bearer ")) {
    throw new AuthenticationError("No bearer token found in the Authorization header.");
  }

  const token = authorization.substring(7);

  if (Array.isArray(token)) {
    throw new SyntaxError("Received an array of tokens. Please provide a string.");
  }

  const accessToken = await prisma.accessToken.findUnique({
    where: { sha256: hashToken(token) },
  });

  if (accessToken === null) {
    throw new AuthenticationError("The given token is invalid.");
  }

  const { username } = accessToken;
  const quota = await rateLimiter(username);

  return {
    prisma,
    username,
    permissions: new Permissions(accessToken.permissions),
    accessToken,
    quota,
  };
}

/** API quotas */
async function rateLimiter(username: string): Promise<UsageQuotaApi> {
  const quota = await prisma.usageQuota.findUnique({
    where: { username },
  });

  if (quota === null) {
    await prisma.usageQuota.create({
      data: {
        username,
        api: {
          connectOrCreate: {
            where: { username },
            create: {},
          },
        },
      },
    });
  }

  const apiQuota = await prisma.usageQuotaApi.findUnique({
    where: { username },
  });

  if (apiQuota === null) {
    throw new Error("API quota not found.");
  }

  if (apiQuota.limit < 0) {
    return apiQuota;
  }

  const data: Prisma.UsageQuotaApiUpdateInput = {
    used: apiQuota.used + 1,
  };

  // Reset quota
  if (apiQuota.reset.getTime() - Date.now() < 0) {
    data.reset = new Date(Date.now() + 3_600_000);
    data.used = 0;
  }

  await prisma.usageQuotaApi.update({
    where: { username },
    data,
  });

  // DDOS ?
  if (apiQuota.used >= 10 * apiQuota.limit) {
    // Reduces the number of warnings
    if (apiQuota.used % apiQuota.limit === 0) {
      console.warn(`Excessive number of requests from user ${username} (${apiQuota.used})`);
    }
  }

  if (apiQuota.used > apiQuota.limit) {
    throw new ApolloError(`Too many requests, please try again later. (${apiQuota.limit} req/h)`, "TOO_MANY_REQUESTS");
  }

  return apiQuota;
}
