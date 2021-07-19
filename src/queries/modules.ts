import { nonNull, queryField, list } from "nexus";
import { baseArgs, ordering } from "../base";

export const modulesQuery = queryField("modules", {
  type: nonNull(list(nonNull("Module"))),
  args: baseArgs("Module"),
  resolve(_, args, ctx) {
    return ctx.prisma.module.findMany({
      where: {
        OR: [
          {
            private: { equals: false },
          },
          ctx.permissions.get("privateModuleRead") ? { author: { name: { equals: ctx.username } } } : {},
        ],
      },
      ...ordering(args),
    });
  },
});
