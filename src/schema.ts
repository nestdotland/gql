import {
  asNexusMethod,
  makeSchema,
  objectType,
  nonNull,
  inputObjectType,
  arg,
} from "nexus";
import { GraphQLDateTime } from "graphql-iso-date";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: (_parent, _args, context) => {
        return context.prisma.user.findMany();
      },
    });

    t.nonNull.list.nonNull.field("allModules", {
      type: "Module",
      // @ts-ignore
      resolve: (_parent, _args, context) => {
        return context.prisma.module.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.field("addUser", {
      type: "User",
      args: {
        data: nonNull(
          arg({
            type: "UserCreateInput"
          })
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.user.create({
          data: {
            name: args.data.name,
            fullName: args.data.fullName,
            bioText: args.data.bioText,
            email: args.data.email,
          },
        });
      },
    })
  },
});

const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("name");
    t.string("fullName");
    t.string("bioText");
    t.string("email");
    t.list.field("modules", {
      type: "Module",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.user.findUnique({
          where: { name: parent.name },
        }).modules();
      },
    });
    // TODO: contributions
    t.list.field("publications", {
      type: "Version",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.user.findUnique({
          where: { name: parent.name },
        }).publications();
      },
    });
  },
});

const Module = objectType({
  name: "Module",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("authorName");
    t.string("fullName")
    t.string("description");
    t.string("homepage");
    t.string("repository");
    t.string("issues");
    t.string("license");
    t.nonNull.string("license");
    t.nonNull.boolean("private");
    t.nonNull.boolean("unlisted");
    t.nonNull.string("ignore");
    // TODO: hooks
    t.string("main");
    t.list.string("bin");
    t.list.string("keywords");
    t.string("logo");
    t.nonNull.date("lastSync");
    t.nonNull.field("author", {
      type: "User",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.module.findUnique({
          where: {
            authorName_name: {
              authorName: parent.authorName,
              name: parent.name,
            },
          },
        }).author();
      },
    });
    // TODO contributors
    t.field("tags", {
      type: "Tag",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.module.findUnique({
          where: {
            authorName_name: {
              authorName: parent.authorName,
              name: parent.name,
            },
          },
        }).tags();
      },
    });
    t.list.field("versions", {
      type: "Version",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.module.findUnique({
          where: {
            authorName_name: {
              authorName: parent.authorName,
              name: parent.name,
            },
          },
        }).versions();
      },
    });
    t.field("latest", {
      type: "Version",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.module.findUnique({
          where: {
            authorName_name: {
              authorName: parent.authorName,
              name: parent.name,
            },
          },
        }).latest();
      },
    });
  },
});

const Version = objectType({
  name: "Version",
  definition(t) {
    t.nonNull.string("version");
    t.nonNull.date("published");
    t.nonNull.boolean("deprecated");
    t.nonNull.boolean("vulnerable");
    t.list.string("supportedDeno");
    t.nonNull.field("module", {
      type: "Module",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              version: parent.version,
            },
          },
        }).module();
      },
    });
    t.nonNull.string("authorName");
    t.nonNull.string("moduleName");
    t.nonNull.field("publisher", {
      type: "User",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              version: parent.version,
            },
          },
        }).publisher();
      },
    });
    t.field("tag", {
      type: "Tag",
      resolve: (parent, _, context) => {
        return context.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              version: parent.version,
            },
          },
        }).tag();
      },
    });
    t.field("latestOf", {
      type: "Module",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              version: parent.version,
            },
          },
        }).latestOf();
      },
    });
    t.list.field("files", {
      type: "File",
      resolve: (parent, _, context) => {
        return context.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              version: parent.version,
            },
          },
        }).files();
      },
    });

    // TODO dependencies
  },
});

const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.field("module", {
      type: "Module",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.tag.findUnique({
          where: {
            authorName_moduleName_versionTag_name: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              versionTag: parent.versionTag,
              name: parent.name,
            },
          },
        }).module();
      },
    });
    t.nonNull.field("version", {
      type: "Version",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.tag.findUnique({
          where: {
            authorName_moduleName_versionTag_name: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              versionTag: parent.versionTag,
              name: parent.name,
            },
          },
        }).version();
      },
    });
    t.nonNull.string("authorName");
    t.nonNull.string("moduleName");
    t.nonNull.string("versionTag");
  },
});

const File = objectType({
  name: "File",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("path");
    t.nonNull.string("type");
    t.nonNull.string("hash");
    t.nonNull.string("txID");
    t.nonNull.field("version", {
      type: "Version",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.file.findUnique({
          where: {
            authorName_moduleName_versionTag_path: {
              authorName: parent.authorName,
              moduleName: parent.moduleName,
              versionTag: parent.versionTag,
              path: parent.path,
            },
          },
        }).version();
      },
    });
    t.nonNull.string("authorName");
    t.nonNull.string("moduleName");
    t.nonNull.string("versionTag");
  },
});

const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fullName");
    t.string("bioText");
    t.string("email");
  },
});

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    Module,
    Version,
    Tag,
    File,
    UserCreateInput,
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
