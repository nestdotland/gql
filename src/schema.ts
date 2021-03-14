import { asNexusMethod, makeSchema } from "nexus";
import { GraphQLDateTime } from "graphql-iso-date";
import { plugins } from "./plugins";
import * as queries from "./crud/queries";
import * as mutations from "./crud/mutations";
import * as types from "./types/model";
import * as input_types from "./types/input";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

export const schema = makeSchema({
  types: [queries, mutations, types, DateTime, input_types],
  plugins,
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
