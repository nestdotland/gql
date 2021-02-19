import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";

export interface Context {
  prisma: PrismaClient;
  authorized: boolean
}

const prisma = new PrismaClient();

export async function context({ req }: ExpressContext): Promise<Context> {
/*   // simple auth check on every request
  const auth = req.headers && req.headers.authorization || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] || null; */
  return {
    // WIP
    authorized: false,
    prisma
  };
}
