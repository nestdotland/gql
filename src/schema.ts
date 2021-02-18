import { asNexusMethod, makeSchema } from "nexus";
import { GraphQLDateTime } from "graphql-iso-date";
import { Query } from "./queries";
import { Mutation } from "./mutations";
import {
  File,
  Hooks,
  Module,
  Tag,
  User,
  UserCreateInput,
  Version,
} from "./object_types";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    File,
    Hooks,
    Module,
    Tag,
    User,
    UserCreateInput,
    Version,
    DateTime,
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
