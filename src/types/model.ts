import { objectType } from "nexus";
import { readAccess } from "../utils/access";
import { modelOptions } from "../utils/model";

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
        return ctx.user === user.name &&
          (ctx.type === "session" || (ctx.type === "token" && readAccess(ctx.accessToken.accessTokens)))
          ? originalResolve(user, args, ctx, info)
          : [];
      },
    });
    t.model.sessions({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        return ctx.user === user.name && ctx.type === "session" ? originalResolve(user, args, ctx, info) : [];
      },
    });
    /** Hide private modules if not authorized */
    t.model.modules({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.private = equalsFalse(
          ctx.user === user.name &&
            (ctx.type === "session" || (ctx.type === "token" && readAccess(ctx.accessToken.accessPrivateConfigs)))
        );
        return originalResolve(user, args, ctx, info);
      },
    });
    /** Hide private contributions if not authorized */
    t.model.contributions({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module ??= {};
        args.where.module.private = equalsFalse(
          ctx.user === user.name &&
            (ctx.type === "session" || (ctx.type === "token" && readAccess(ctx.accessToken.accessPrivateContributions)))
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
      description: "Only available when creating a token.",
    });
    /* Permissions */
    t.model.accessProfile();
    t.model.accessTokens();
    t.model.accessVersions();
    t.model.accessConfigs();
    t.model.accessPrivateVersions();
    t.model.accessPrivateConfigs();
    t.model.accessPrivateContributions();
  },
});

export const ModuleContributor = objectType({
  name: "ModuleContributor",
  definition(t) {
    t.model.contributor();
    t.model.module();
    /* Permissions */
    t.model.accessVersions();
    t.model.accessConfig();
    t.model.accessContributors();
  },
});

export const Session = objectType({
  name: "Session",
  definition(t) {
    t.model.dateCreated();
    t.string("token", {
      description: "Only available when logging in.",
    });
  },
});
