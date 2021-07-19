import { ThirdPartyModule } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";

export const ThirdPartyModuleOrderInput = createOrder({
  name: "ThirdPartyModule",
  members: [
    {
      value: "path",
    },
  ],
});

export const ThirdPartyModuleType = objectType({
  ...setupObjectType(ThirdPartyModule),
  definition(t) {
    t.field(ThirdPartyModule.path);

    t.field(ThirdPartyModule.host);
    t.field({
      ...ThirdPartyModule.dependents,
      complexity,
      type: nonNull(list(nonNull("Version"))),
      args: baseArgs("Version"),
      resolve(module, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            thirdPartyDependencies: {
              some: {
                dependencyHost: { equals: module.hostname },
                dependencyPath: { equals: module.path },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
