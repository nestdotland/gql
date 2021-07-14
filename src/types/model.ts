import { objectType } from "nexus";
import { modelOptions } from "../utils/model";
import { Keys as PermissionKeys, Permissions } from "../utils/permission";

function setEqualsFalse(bool: boolean) {
  return bool ? {} : { equals: false };
}

// TODO: remove join tables

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.model.name();
    t.model.fullName();
    t.model.avatar();
    t.model.bio();
    t.model.funding();
    t.model.verified();
    t.model.createdAt();
    t.model.updatedAt();
    t.nonNull.boolean("isViewer", {
      resolve(user, _args, ctx) {
        return user.name === ctx.username;
      },
    });

    /** Hide private modules if not authorized */
    t.model.modules({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.private = setEqualsFalse(
          ctx.username === user.name &&
            ctx.permissions.get("privateModuleRead"),
        );
        return originalResolve(user, args, ctx, info);
      },
    });
    t.model.publications(modelOptions);
    /** Hide private contributions if not authorized */
    t.model.contributions({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module ??= {};
        args.where.module.private = setEqualsFalse(
          ctx.username === user.name &&
            ctx.permissions.get("privateModuleRead"),
        );
        return originalResolve(user, args, ctx, info);
      },
    });
    /** Hide usage quotas of other users */
    t.model.usageQuota({
      resolve(user, args, ctx, info, originalResolve) {
        return user.name === ctx.username
          ? originalResolve(user, args, ctx, info)
          : null;
      },
    });
    /** Hide access tokens of other users */
    t.model.accessTokens({
      ...modelOptions,
      resolve(user, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.username = {
          equals: ctx.username,
        };
        return originalResolve(user, args, ctx, info);
      },
    });
  },
});

export const ModuleType = objectType({
  name: "Module",
  definition(t) {
    t.model.name();
    t.model.fullName();
    t.model.description();
    t.model.homepage();
    t.model.repository();
    t.model.bugs();
    t.model.funding();
    t.model.license();
    t.model.logo();
    t.model.keywords();
    t.model.verified();
    t.model.malicious();
    t.model.private();
    t.model.unlisted();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.versions(modelOptions);
    t.model.contributors(modelOptions);
    t.model.author();
    t.model.tags(modelOptions);
    t.model.publishConfig();
    t.model.devConfig();
  },
});

export const VersionType = objectType({
  name: "Version",
  definition(t) {
    t.model.name();
    t.model.deprecated();
    t.model.vulnerable();
    t.model.unlisted();
    t.model.supportedDeno();
    t.model.main();
    t.model.bin();
    t.model.lockfile();
    t.model.importMap();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.files(modelOptions);
    t.model.tag(modelOptions);
    t.model.module();
    t.model.publisher();
    t.model.dependents(modelOptions);
    t.model.dependencies(modelOptions);
    t.model.taggedDependencies(modelOptions);
    t.model.thirdPartyDependencies(modelOptions);
  },
});

export const TagType = objectType({
  name: "Tag",
  definition(t) {
    t.model.name();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.module();
    t.model.version();
    t.model.dependents(modelOptions);
  },
});

export const FileType = objectType({
  name: "File",
  definition(t) {
    t.model.path();
    t.model.url();
    t.model.mimeType();
    t.model.createdAt();

    t.model.version();
  },
});

export const PublishConfigType = objectType({
  name: "PublishConfig",
  definition(t) {
    t.model.main();
    t.model.bin();
    t.model.lockfile();
    t.model.importMap();
    t.model.updatedAt();

    t.model.module();
  },
});

export const DevConfigType = objectType({
  name: "DevConfig",
  definition(t) {
    t.model.ignore();
    t.model.updatedAt();

    t.model.module();
    t.model.hooks(modelOptions);
  },
});

export const DevConfigHookType = objectType({
  name: "DevConfigHook",
  definition(t) {
    t.model.key();
    t.model.mode();
    t.model.value();
    t.model.updatedAt();

    t.model.config();
  },
});

export const UsageQuotaType = objectType({
  name: "UsageQuota",
  definition(t) {
    t.model.user();
    t.model.api();
    t.model.publish();
  },
});

export const UsageQuotaApiType = objectType({
  name: "UsageQuotaApi",
  definition(t) {
    t.model.limit();
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.model.used();
    t.model.reset();

    t.model.quota();
  },
});

export const UsageQuotaPublishType = objectType({
  name: "UsageQuotaPublish",
  definition(t) {
    t.model.limit();
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.model.used();
    t.model.size();
    t.model.private();
    t.model.reset();

    t.model.quota();
  },
});

export const DependencyGraphType = objectType({
  name: "DependencyGraph",
  definition(t) {
    t.model.dependent();
    t.model.dependency();
  },
});

export const TaggedDependencyGraphType = objectType({
  name: "TaggedDependencyGraph",
  definition(t) {
    t.model.dependent();
    t.model.dependency();
  },
});

export const ThirdPartyModuleType = objectType({
  name: "ThirdPartyModule",
  definition(t) {
    t.model.path();

    t.model.host();
    t.model.dependents(modelOptions);
  },
});

export const ThirdPartyHostType = objectType({
  name: "ThirdPartyHost",
  definition(t) {
    t.model.hostname();
    t.model.verified();

    t.model.modules(modelOptions);
  },
});

export const ThirdPartyDependencyGraphType = objectType({
  name: "ThirdPartyDependencyGraph",
  definition(t) {
    t.model.dependent();
    t.model.dependency();
  },
});

export const ContributionType = objectType({
  name: "Contribution",
  definition(t) {
    t.model.contributor();
    t.model.module();
  },
});

export const AccessTokenType = objectType({
  name: "AccessToken",
  sourceType: {
    module: "@prisma/client",
    export: "AccessToken",
  },
  definition(t) {
    t.model.sha256();
    t.field("permissions", {
      type: "Permissions",
      resolve(token) {
        return new Permissions(token.permissions);
      },
    });
    t.nonNull.int("permissionsInteger", {
      resolve(token) {
        return parseInt(token.permissions, 2);
      },
    });
    t.model.createdAt();
    t.model.updatedAt();
    t.nonNull.boolean("isUsed", {
      resolve(token, _args, ctx) {
        return token.sha256 === ctx.accessToken.sha256;
      },
    });

    t.model.user();
  },
});

export const PermissionsType = objectType({
  name: "Permissions",
  sourceType: {
    module: `${__dirname}/../utils/permission.ts`,
    export: "Permissions",
  },
  definition(t) {
    for (const key in PermissionKeys) {
      if (isNaN(parseInt(key))) {
        t.nonNull.boolean(key, {
          resolve(permissions) {
            return permissions.get(key as keyof typeof PermissionKeys);
          },
        });
      }
    }
  },
});
