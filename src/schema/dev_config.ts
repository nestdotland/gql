import { DevConfig, HookKey, HookMode } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import {
  baseArgs,
  complexity,
  createOrder,
  ordering,
  setupObjectType,
} from "../base";

export const DevConfigOrderInput = createOrder({
  name: "DevConfig",
  members: [{
    value: "updatedAt",
    by: "update time",
  }],
});

export const DevConfigType = objectType({
  ...setupObjectType(DevConfig),
  definition(t) {
    t.field(DevConfig.ignore);
    t.field(DevConfig.updatedAt);

    t.field({
      ...DevConfig.hooks,
      complexity() {
        return HookKey.members.length * HookMode.members.length
      },
      type: nonNull(list(nonNull("DevConfigHook"))),
      async resolve(config, _args, ctx) {
        return ctx.prisma.devConfigHook.findMany({
          where: {
            authorName: {equals: config.authorName},
            moduleName: {equals: config.moduleName}
          },
        });
      },
    });
  },
});
