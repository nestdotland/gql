import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.name();
    t.model.fullName();
    t.model.bioText();
    t.model.email();
    /** Hide access tokens if not authorized
     * proof of concept */
    t.model.accessTokens({
      resolve(user, args, ctx, info, originalResolve) {
        return ctx.authorized ? originalResolve(user, args, ctx, info) : [];
      },
    });
    t.list.field("modules", {
      type: "Module",
      // @ts-ignore
      resolve(user, _, context) {
        return context.prisma.user
          .findUnique({
            where: { name: user.name },
          })
          .modules({
            where: {
              private: context.authorized ? {} : {
                equals: false,
              },
            },
          });
      },
    });
    t.list.field("contributions", {
      type: "Module",
      // @ts-ignore
      resolve(user, _, context) {
        return context.prisma.module.findMany({
          where: {
            contributors: {
              some: {
                contributorName: user.name,
              },
            },
            private: context.authorized ? {} : {
              equals: false,
            },
          },
        });
      },
    });
    t.list.field("publications", {
      type: "Version",
      // @ts-ignore
      resolve(user, _, context) {
        return context.prisma.user
          .findUnique({
            where: { name: user.name },
          })
          .publications({
            where: {
              module: {
                private: context.authorized ? {} : {
                  equals: false,
                },
              }
            }
          });
      },
    });
  },
});

export const Module = objectType({
  name: "Module",
  definition(t) {
    t.model.name();
    t.model.authorName();
    t.model.fullName();
    t.model.description();
    t.model.homepage();
    t.model.repository();
    t.model.issues();
    t.model.license();
    t.model.license();
    t.model.private();
    t.model.unlisted();
    t.model.ignore();
    t.model.main();
    t.model.bin();
    t.model.keywords();
    t.model.logo();
    t.model.lastSync();
    t.field("author", {
      type: "User",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.module
          .findUnique({
            where: {
              authorName_name: {
                authorName: module.authorName,
                name: module.name,
              },
            },
          })
          .author();
      },
    });
    t.list.field("contributors", {
      type: "User",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.user.findMany({
          where: {
            contributions: {
              some: {
                authorName: module.authorName,
                moduleName: module.name,
              },
            },
          },
        });
      },
    });
    t.list.field("tags", {
      type: "Tag",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.module
          .findUnique({
            where: {
              authorName_name: {
                authorName: module.authorName,
                name: module.name,
              },
            },
          })
          .tags();
      },
    });
    t.list.field("versions", {
      type: "Version",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.module
          .findUnique({
            where: {
              authorName_name: {
                authorName: module.authorName,
                name: module.name,
              },
            },
          })
          .versions();
      },
    });
    t.field("latest", {
      type: "Version",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.module
          .findUnique({
            where: {
              authorName_name: {
                authorName: module.authorName,
                name: module.name,
              },
            },
          })
          .latest();
      },
    });
    t.field("hooks", {
      type: "Hooks",
      // @ts-ignore
      resolve(module, _, context) {
        return context.prisma.module
          .findUnique({
            where: {
              authorName_name: {
                authorName: module.authorName,
                name: module.name,
              },
            },
          })
          .hooks();
      },
    });
  },
});

export const Hooks = objectType({
  name: "Hooks",
  definition(t) {
    t.model.presync();
    t.model.postsync();
    t.model.prepublish();
    t.model.postpublish();
  },
});

export const Version = objectType({
  name: "Version",
  definition(t) {
    t.model.version();
    t.model.published();
    t.model.deprecated();
    t.model.vulnerable();
    t.model.supportedDeno();
    t.model.dependencies();
    t.nonNull.field("module", {
      type: "Module",
      // @ts-ignore
      resolve(version, _, context) {
        return context.prisma.version
          .findUnique({
            where: {
              authorName_moduleName_version: {
                authorName: version.authorName,
                moduleName: version.moduleName,
                version: version.version,
              },
            },
          })
          .module();
      },
    });
    t.model.authorName();
    t.model.moduleName();
    t.nonNull.field("publisher", {
      type: "User",
      // @ts-ignore
      resolve(version, _, context) {
        return context.prisma.version
          .findUnique({
            where: {
              authorName_moduleName_version: {
                authorName: version.authorName,
                moduleName: version.moduleName,
                version: version.version,
              },
            },
          })
          .publisher();
      },
    });
    t.field("tag", {
      type: "Tag",
      resolve(version, _, context) {
        return context.prisma.version
          .findUnique({
            where: {
              authorName_moduleName_version: {
                authorName: version.authorName,
                moduleName: version.moduleName,
                version: version.version,
              },
            },
          })
          .tag();
      },
    });
    t.field("latestOf", {
      type: "Module",
      // @ts-ignore
      resolve(version, _, context) {
        return context.prisma.version
          .findUnique({
            where: {
              authorName_moduleName_version: {
                authorName: version.authorName,
                moduleName: version.moduleName,
                version: version.version,
              },
            },
          })
          .latestOf();
      },
    });
    t.list.field("files", {
      type: "File",
      resolve(version, _, context) {
        return context.prisma.version
          .findUnique({
            where: {
              authorName_moduleName_version: {
                authorName: version.authorName,
                moduleName: version.moduleName,
                version: version.version,
              },
            },
          })
          .files();
      },
    });
  },
});

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.name();
    t.nonNull.field("module", {
      type: "Module",
      // @ts-ignore
      resolve(tag, _, context) {
        return context.prisma.tag
          .findUnique({
            where: {
              authorName_moduleName_versionTag_name: {
                authorName: tag.authorName,
                moduleName: tag.moduleName,
                versionTag: tag.versionTag,
                name: tag.name,
              },
            },
          })
          .module();
      },
    });
    t.nonNull.field("version", {
      type: "Version",
      // @ts-ignore
      resolve(tag, _, context) {
        return context.prisma.tag
          .findUnique({
            where: {
              authorName_moduleName_versionTag_name: {
                authorName: tag.authorName,
                moduleName: tag.moduleName,
                versionTag: tag.versionTag,
                name: tag.name,
              },
            },
          })
          .version();
      },
    });
    t.model.authorName();
    t.model.moduleName();
    t.model.versionTag();
  },
});

export const File = objectType({
  name: "File",
  definition(t) {
    t.model.name();
    t.model.path();
    t.model.type();
    t.model.hash();
    t.model.txID();
    t.nonNull.field("version", {
      type: "Version",
      // @ts-ignore
      resolve(file, _, context) {
        return context.prisma.file
          .findUnique({
            where: {
              authorName_moduleName_versionTag_path: {
                authorName: file.authorName,
                moduleName: file.moduleName,
                versionTag: file.versionTag,
                path: file.path,
              },
            },
          })
          .version();
      },
    });
    t.model.authorName();
    t.model.moduleName();
    t.model.versionTag();
  },
});
