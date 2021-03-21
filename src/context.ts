import { AccessToken, PrismaClient, Session } from "@prisma/client";
import { ApolloError, AuthenticationError, ExpressContext, SyntaxError } from "apollo-server-express";
import { hashToken } from "./utils/token";
import { HOURLY_REQUEST_LIMIT } from "./utils/env";

interface BaseContext {
  user: string;
  prisma: PrismaClient;
}
interface ContextSession extends BaseContext {
  accessToken: AccessToken;
  type: "token";
}
interface ContextToken extends BaseContext {
  session: Session;
  type: "session";
}
interface ContextLogin extends BaseContext {
  type: "login";
}
export type Context = ContextSession | ContextToken | ContextLogin;

const prisma = new PrismaClient();

/** Auth check on every request */
export async function context({ req }: ExpressContext): Promise<Context> {
  // TODO: change headers
  const token = req.headers && req.headers.token;
  const session = req.headers && req.headers.session;
  const username = req.headers && req.headers.username;
  const password = req.headers && req.headers.password;

  // **** AccessToken ****
  if (token) {
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
      rateLimiter(accessToken.ownerName);
    }

    return {
      prisma,
      accessToken,
      user: accessToken.ownerName,
      type: "token",
    };
  }

  // **** Session ****
  if (session) {
    if (Array.isArray(session)) {
      throw new SyntaxError("Received an array of session tokens. Please provide a string.");
    }

    const sessionToken = await prisma.session.findUnique({
      where: {
        tokenHash: hashToken(session),
      },
    });

    if (sessionToken === null) {
      throw new AuthenticationError("The given token is invalid.");
    }

    rateLimiter(sessionToken.userName);

    return {
      prisma,
      user: sessionToken.userName,
      session: sessionToken,
      type: "session",
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
      where: {
        name: username,
      },
    });

    if (user === null) {
      throw new AuthenticationError("The given username doesn't exist.");
    }

    rateLimiter(username);
    if (user.passwordHash !== hashToken(password)) {
      throw new AuthenticationError("Wrong password.");
    }

    return {
      prisma,
      user: username,
      type: "login",
    };
  }

  throw new AuthenticationError("GraphQL API is authenticated only. Please provide an access token.");
}

async function rateLimiter(name: string) {
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
