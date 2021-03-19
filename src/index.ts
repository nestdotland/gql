import { server } from "./server";
import { GRAPHQL_PORT } from "./utils/env";

server.listen({ port: GRAPHQL_PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at: ${url}`);
});
