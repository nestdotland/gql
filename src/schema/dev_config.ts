import { DevConfig, HookKey, HookMode } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";
import { toHook } from "./hooks";

export const DevConfigOrderInput = createOrder({
  name: "DevConfig",
  members: [
    {
      value: "updatedAt",
      by: "update time",
    },
  ],
});

export const DevConfigType = objectType({
  ...setupObjectType(DevConfig),
  definition(t) {
    t.field(DevConfig.ignore);
    t.field(DevConfig.updatedAt);

    t.field("hooks", {
      type: "Hooks",
      async resolve(config, _args, ctx) {
        const hooks = await ctx.prisma.devConfigHook.findMany({
          where: {
            authorName: { equals: config.authorName },
            moduleName: { equals: config.moduleName },
          },
        });
        return new Map(hooks.map((hook) => [toHook(hook.mode, hook.key), hook.value]));
      },
    });
  },
});
