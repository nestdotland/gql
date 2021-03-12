import { inputObjectType, objectType } from "nexus";

export const modelOptions = {
  pagination: true,
  ordering: true,
  filtering: true,
};

function equalsFalse(bool: boolean) {
  return bool ? {} : { equals: false };
}

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.name();
    t.model.fullName();
    t.model.bioText();
    t.model.email();
    /** Hide access tokens if not authorized */
    t.model.accessTokens({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        return ctx.accessToken.ownerName === user.name && ctx.accessToken.readAccessTokens
          ? originalResolve(user, args, ctx, info)
          : [];
      },
    });
    t.model.modules({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.private = equalsFalse(ctx.accessToken.ownerName === user.name && ctx.accessToken.readPrivateModules);
        return originalResolve(user, args, ctx, info);
      },
    });
    t.model.contributions({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module ??= {};
        args.where.module.private = equalsFalse(
          ctx.accessToken.ownerName === user.name && ctx.accessToken.readPrivateContributions
        );
        return originalResolve(user, args, ctx, info);
      },
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
    t.model.keywords();
    t.model.main();
    t.model.bin();
    t.model.logo();
    t.model.lastSync();
    t.model.author();
    t.model.contributors(modelOptions);
    t.model.tags(modelOptions);
    t.model.versions(modelOptions);
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
    t.model.main();
    t.model.bin();
    t.model.logo();
    t.model.module();
    t.model.publisher();
    t.model.tag();
    t.model.files(modelOptions);
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

export const AccessToken = objectType({
  name: "AccessToken",
  definition(t) {
    t.model.name();
    t.model.owner();
    t.string("token", {
      description: "Only available when creating a token",
    });
    t.model.readAccessTokens();
    t.model.writeAccessTokens();
    t.model.readPrivateModules();
    t.model.readPrivateContributions();
  },
});

export const ModuleContributors = objectType({
  name: "ModuleContributors",
  definition(t) {
    t.model.contributor();
    t.model.module();
    t.model.readConfig();
    t.model.writeConfig();
    t.model.readModule();
    t.model.writeModule();
  },
});

export const ProfileUpdateInput = inputObjectType({
  name: "ProfileUpdateInput",
  definition(t) {
    t.string("fullName");
    t.string("bioText");
    t.string("email");
  },
});

export const AccessTokenCreateInput = inputObjectType({
  name: "AccessTokenCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.boolean("readAccessTokens");
    t.boolean("writeAccessTokens");
    t.boolean("readPrivateModules");
    t.boolean("readPrivateContributions");
  },
});

export const AccessTokenUpdateInput = inputObjectType({
  name: "AccessTokenUpdateInput",
  definition(t) {
    t.string("name");
    t.boolean("readAccessTokens");
    t.boolean("writeAccessTokens");
    t.boolean("readPrivateModules");
    t.boolean("readPrivateContributions");
  },
});
