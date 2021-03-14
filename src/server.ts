import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema: schema,
  context: context,
});
