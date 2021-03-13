import { asNexusMethod, makeSchema } from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { GraphQLDateTime } from "graphql-iso-date";
import * as queries from "./queries";
import * as mutations from "./mutations";
import * as types from "./object_types";
import * as input_types from "./input_object_types";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

export const schema = makeSchema({
  types: [queries, mutations, types, DateTime, input_types],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
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
