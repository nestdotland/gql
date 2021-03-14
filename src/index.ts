import express from "express";
import { server } from "./server";
import { GRAPHQL_PORT } from "./utils/env";

const app = express();

server.applyMiddleware({ app, path: "/" });

app.use((_req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

app.listen({ port: GRAPHQL_PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`);
});
