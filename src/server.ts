import { ApolloServer } from "apollo-server";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import { separateOperations } from "graphql";
import { schema } from "./schema";
import { Context, context } from "./context";
import { ForbiddenError } from "apollo-server-express";

export const server = new ApolloServer({
  schema,
  context,
  plugins: [
    {
      requestDidStart: ({ context }) => {
        const { maxComplexity } = (context as Context).quota;
        if (maxComplexity > 0) {
          return {
            didResolveOperation({ request, document }) {
              const complexity = getComplexity({
                schema,
                // To calculate query complexity properly,
                // we have to check if the document contains multiple operations
                // and eventually extract it operation from the whole query document.
                query: request.operationName ? separateOperations(document)[request.operationName] : document,
                variables: request.variables,
                estimators: [
                  // Enables nexus custom complexity fields.
                  fieldExtensionsEstimator(),
                  // This will assign each field a complexity of 1
                  // if no other estimator returned a value.
                  simpleEstimator({ defaultComplexity: 1 }),
                ],
              });
              if (complexity >= maxComplexity) {
                throw new ForbiddenError(
                  `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`
                );
              }
            },
          };
        }
      },
    },
  ],
});
