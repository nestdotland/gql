import { objectType } from "nexus";

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: (_parent, _args, context) => {
        return context.prisma.user.findMany();
      },
    });

    t.nonNull.list.nonNull.field("allModules", {
      type: "Module",
      // @ts-ignore
      resolve: (_parent, _args, context) => {
        return context.prisma.module.findMany();
      },
    });
  },
});
