import {
  AccessToken,
  DevConfig,
  DevConfigHook,
  File,
  HookKey,
  HookMode,
  Module,
  PublishConfig,
  Tag,
  ThirdPartyHost,
  ThirdPartyModule,
  UsageQuota,
  UsageQuotaApi,
  UsageQuotaPublish,
  User,
  Version,
} from "nexus-prisma";
import {
  arg,
  enumType,
  inputObjectType,
  intArg,
  nonNull,
  objectType,
} from "nexus";

export const PublishConfigType = objectType({
  name: PublishConfig.$name,
  description: PublishConfig.$description,
  definition(t) {
    t.field(PublishConfig.main);
    t.field(PublishConfig.bin);
    t.field(PublishConfig.lockfile);
    t.field(PublishConfig.importMap);
    t.field(PublishConfig.updatedAt);

    // t.model.module();
  },
});

export const DevConfigType = objectType({
  name: DevConfig.$name,
  description: DevConfig.$description,
  definition(t) {
    t.field(DevConfig.ignore);
    t.field(DevConfig.updatedAt);

    // t.model.module();
    // t.model.hooks(modelOptions);
  },
});

export const HookModeEnum = enumType(HookMode);
export const HookKeyEnum = enumType(HookKey);

export const DevConfigHookType = objectType({
  name: DevConfigHook.$name,
  description: DevConfigHook.$description,
  definition(t) {
    t.field(DevConfigHook.key);
    t.field(DevConfigHook.mode);
    t.field(DevConfigHook.value);
    t.field(DevConfigHook.updatedAt);

    // t.model.config();
  },
});

export const UsageQuotaType = objectType({
  name: UsageQuota.$name,
  description: UsageQuota.$description,
  definition(t) {
    t.field(UsageQuota.user);
    t.field(UsageQuota.api);
    t.field(UsageQuota.publish);
  },
});

export const UsageQuotaApiType = objectType({
  name: UsageQuotaApi.$name,
  description: UsageQuotaApi.$description,
  definition(t) {
    t.field(UsageQuotaApi.limit);
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.field(UsageQuotaApi.used);
    t.field(UsageQuotaApi.reset);

    // t.model.quota();
  },
});

export const UsageQuotaPublishType = objectType({
  name: UsageQuotaPublish.$name,
  description: UsageQuotaPublish.$description,
  definition(t) {
    t.field(UsageQuotaPublish.limit);
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.field(UsageQuotaPublish.used);
    t.field(UsageQuotaPublish.size);
    t.field(UsageQuotaPublish.private);
    t.field(UsageQuotaPublish.reset);

    // t.model.quota();
  },
});

export const ThirdPartyModuleType = objectType({
  name: ThirdPartyModule.$name,
  description: ThirdPartyModule.$description,
  definition(t) {
    t.field(ThirdPartyModule.path);

    // t.model.host();
    // t.model.dependents(modelOptions);
  },
});

export const ThirdPartyHostType = objectType({
  name: ThirdPartyHost.$name,
  description: ThirdPartyHost.$description,
  definition(t) {
    t.field(ThirdPartyHost.hostname);
    t.field(ThirdPartyHost.verified);

    // t.model.modules(modelOptions);
  },
});

export const AccessTokenType = objectType({
  name: AccessToken.$name,
  description: AccessToken.$description,
  definition(t) {
    t.field(AccessToken.sha256);
    // t.field("permissions", {
    //   type: "Permissions",
    //   resolve(token) {
    //     return new Permissions(token.permissions);
    //   },
    // });
    // t.nonNull.int("permissionsInteger", {
    //   resolve(token) {
    //     return parseInt(token.permissions, 2);
    //   },
    // });
    // t.model.createdAt();
    // t.model.updatedAt();
    // t.nonNull.boolean("isUsed", {
    //   resolve(token, _args, ctx) {
    //     return token.sha256 === ctx.accessToken.sha256;
    //   },
    // });

    // t.model.user();
  },
});

// export const PermissionsType = objectType({
//   name: "Permissions",
//   sourceType: {
//     module: `${__dirname}/../utils/permission.ts`,
//     export: "Permissions",
//   },
//   definition(t) {
//     for (const key in PermissionKeys) {
//       if (isNaN(parseInt(key))) {
//         t.nonNull.boolean(key, {
//           resolve(permissions) {
//             return permissions.get(key as keyof typeof PermissionKeys);
//           },
//         });
//       }
//     }
//   },
// });
