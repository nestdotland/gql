import express from "express";
import { server } from "./server";
import { graphqlPort } from "./utils/env";

const app = express();

server.applyMiddleware({ app, path: "/" });

app.use((_req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

app.listen({ port: graphqlPort }, () => {
  console.log(`🚀 Server ready at http://localhost:${graphqlPort}${server.graphqlPath}`);
});
