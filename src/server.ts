import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { context } from "./context";
import dotenv from "dotenv";

dotenv.config();

const server = new ApolloServer({
  schema: schema,
  context: context,
});

server.listen().then(async ({ url }) => {
  console.log(`🚀 Server ready at: ${url}`);
});
