import { prisma } from "@prisma/client";
import { inputObjectType, objectType } from "nexus";

export const User = objectType({
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
    t.list.field("contributions", {
      type: "Module",
      // @ts-ignore
      resolve: async (parent, _, context) => {
        return context.prisma.module.findMany({
          where: {
            contributors: {
              some: {
                contributorName: parent.name,
              },
            },
          },
        });
      },
    });
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

export const Module = objectType({
  name: "Module",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("authorName");
    t.string("fullName");
    t.string("description");
    t.string("homepage");
    t.string("repository");
    t.string("issues");
    t.string("license");
    t.nonNull.string("license");
    t.nonNull.boolean("private");
    t.nonNull.boolean("unlisted");
    t.nonNull.string("ignore");
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
    t.list.field("contributors", {
      type: "User",
      // @ts-ignore
      resolve: async (parent, _, context) => {
        return context.prisma.user.findMany({
          where: {
            contributions: {
              some: {
                authorName: parent.authorName,
                moduleName: parent.name,
              },
            },
          },
        });
      },
    });
    t.list.field("tags", {
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
    t.field("hooks", {
      type: "Hooks",
      // @ts-ignore
      resolve: (parent, _, context) => {
        return context.prisma.module.findUnique({
          where: {
            authorName_name: {
              authorName: parent.authorName,
              name: parent.name,
            },
          },
        }).hooks();
      },
    });
  },
});

export const Hooks = objectType({
  name: "Hooks",
  definition(t) {
    t.string("presync");
    t.string("postsync");
    t.string("prepublish");
    t.string("postpublish");
  },
});

export const Version = objectType({
  name: "Version",
  definition(t) {
    t.nonNull.string("version");
    t.nonNull.date("published");
    t.nonNull.boolean("deprecated");
    t.nonNull.boolean("vulnerable");
    t.list.string("supportedDeno");
    t.list.string("dependencies");
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
  },
});

export const Tag = objectType({
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

export const File = objectType({
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

/* export const ModuleContributors = objectType({
  name: "ModuleContributors",
  definition(t) {
    t.nonNull.string("contributorName")
    t.nonNull.string("module")
    t.nonNull.string("moduleName")
  }
}) */

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fullName");
    t.string("bioText");
    t.string("email");
  },
});
