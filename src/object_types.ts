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
    t.model.modules({
      ordering: true,
      filtering: true,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.private = ctx.authorized
          ? {}
          : {
              equals: false,
            };
        return originalResolve(user, args, ctx, info);
      },
    });
    t.list.field("contributions", {
      type: "Module",
      resolve(user, _, context) {
        return context.prisma.module.findMany({
          where: {
            contributors: {
              some: {
                contributorName: user.name,
              },
            },
            private: context.authorized
              ? {}
              : {
                  equals: false,
                },
          },
        });
      },
    });
    t.model.publications({
      ordering: true,
      filtering: true,
    });
  },
});

export const Module = objectType({
  name: "Module",
  definition(t) {
    t.model.name();
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
    t.model.author();
    t.model.authorName(); // TODO: remove this field
    // t.model.contributors() // FIXME: doesn't work
    t.list.field("contributors", {
      type: "User",
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
    t.model.tags({
      ordering: true,
      filtering: true,
    });
    t.model.versions({
      ordering: true,
      filtering: true,
    });
    t.model.latest();
    t.model.hooks();
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
    t.model.module();
    t.model.publisher();
    t.model.tag();
    t.model.files({
      ordering: true,
      filtering: true,
    });
  },
});

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.name();
    t.model.module();
    t.model.version();
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
    t.model.version();
  },
});

export const ModuleContributors = objectType({
  name: "ModuleContributors",
  definition(t) {
    t.model.contributor();
    t.model.module();
  },
});
