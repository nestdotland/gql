import { asNexusMethod, makeSchema } from "nexus";
import { GraphQLDateTime } from "graphql-iso-date";
import { plugins } from "./plugins";
import * as queries from "./queries/_all";
import * as mutations from "./mutations/_all";
import * as allTypes from "./schema/_all";
import { OrderDirectionEnum } from "./base";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

export const schema = makeSchema({
  types: [allTypes, queries, mutations, DateTime, OrderDirectionEnum],
  plugins,
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
});
