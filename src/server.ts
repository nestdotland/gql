import { ApolloServer } from "apollo-server-express";
import { getComplexity, simpleEstimator } from "graphql-query-complexity";
import { separateOperations } from "graphql";
import { schema } from "./schema";
import { context } from "./context";
import { MAX_QUERY_COMPLEXITY } from "./utils/env";

export const server = new ApolloServer({
  schema,
  context,
  formatError(error) {
    // optional, default to current behavior
    // i am imagining this object is the same as received in onError of apollo-link-error
    const { message } = error;

    console.log("YO");

    // if (operation.somethingElse) { return error }; // conditionally shape the object

    // whatever is returned from formatError is the object received by consumer components as the error object
    return {
      message: message.replace("GraphQL error: ", "").trim(),
    };
  },
  plugins: [
    /* Limits query complexity */
    {
      requestDidStart: () => ({
        didResolveOperation({ request, document }) {
          const complexity = getComplexity({
            schema,
            // To calculate query complexity properly,
            // we have to check if the document contains multiple operations
            // and eventually extract it operation from the whole query document.
            query: request.operationName ? separateOperations(document)[request.operationName] : document,
            variables: request.variables,
            estimators: [
              // This will assign each field a complexity of 1
              // if no other estimator returned a value.
              simpleEstimator({ defaultComplexity: 1 }),
            ],
          });
          if (complexity >= MAX_QUERY_COMPLEXITY) {
            throw new Error(`Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_QUERY_COMPLEXITY}`);
          }
        },
      }),
    },
  ],
});
