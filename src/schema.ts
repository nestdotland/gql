import { asNexusMethod, makeSchema } from "nexus";
import { GraphQLDateTime } from "graphql-iso-date";
import { plugins } from "./plugins";
import * as queries from "./types/queries";
// import * as mutations from "./crud/mutations";
import * as model from "./types/model";
import * as allTypes from "./schema/_all";
import { OrderDirectionEnum } from "./base";
// import * as objects from "./types/objects";
// import * as input_types from "./types/input";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

export const schema = makeSchema({
  types: [OrderDirectionEnum, allTypes, queries, model, DateTime /* input_types */],
  plugins,
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  /* sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  }, */
});
