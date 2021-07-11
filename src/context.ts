import { PrismaClient } from "@prisma/client";
import {
  ApolloError,
  AuthenticationError,
  ExpressContext,
  SyntaxError,
} from "apollo-server-express";
// import { hashToken } from "./utils/token";
// import { HOURLY_REQUEST_LIMIT } from "./utils/env";
// import { rejectLogin, UserPermissions } from "./utils/permission";

export interface Context {
  prisma: PrismaClient;
  /* permissions: UserPermissions;
  user: string;
  token: {
    hash: string;
  }; */
}

const prisma = new PrismaClient();

/** Auth check on every request */
export async function context({ req }: ExpressContext): Promise<Context> {
  return { prisma };
  /* const token = req.headers && req.headers.token;
  const username = req.headers && req.headers.username;
  const password = req.headers && req.headers.password;

  // **** AccessToken & Session ****
  if (token) {
    if (Array.isArray(token)) {
      throw new SyntaxError("Received an array of tokens. Please provide a string.");
    }

    const tokenHash = hashToken(token);
    const accessToken = await prisma.accessToken.findUnique({
      where: { tokenHash },
    });
    const sessionToken = await prisma.session.findUnique({
      where: { tokenHash },
    });

    if (accessToken === null && sessionToken === null) {
      throw new AuthenticationError("The given token is invalid.");
    }

    const user = accessToken?.ownerName ?? sessionToken?.userName!;

    // no request limit for rest api
    if (user !== "nestdotland") {
      rateLimiter(user);
    }

    return {
      prisma,
      permissions: new UserPermissions({
        accessToken,
        isSession: sessionToken !== null,
      }),
      user,
      token: {
        hash: tokenHash,
      },
    };
  }

  // **** Login ****
  if (username && password) {
    if (Array.isArray(username)) {
      throw new SyntaxError("Received an array of usernames. Please provide a string.");
    }
    if (Array.isArray(password)) {
      throw new SyntaxError("Received an array of passwords. Please provide a string.");
    }

    const user = await prisma.user.findUnique({
      where: { name: username },
    });

    if (user === null) {
      throw new AuthenticationError("The given username doesn't exist.");
    }
    if (user.passwordHash !== hashToken(password)) {
      throw new AuthenticationError("Wrong password.");
    }
    rateLimiter(username);

    return {
      prisma,
      permissions: new UserPermissions({
        isLogin: true,
      }),
      user: username,
      token: {
        get hash() {
          rejectLogin();
          return "error";
        },
      },
    };
  } */

  // throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
}

/* async function rateLimiter(name: string) {
  const user = await prisma.user.findUnique({
    where: {
      name,
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
      name,
    },
    data: {
      logs: newLogs,
    },
  });
}
 */
