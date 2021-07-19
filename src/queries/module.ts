import { nonNull, queryField, stringArg } from "nexus";

export const moduleQuery = queryField("module", {
  type: "Module",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return ctx.prisma.module.findUnique({
      where: {
        authorName_name: {
          authorName: args.author,
          name: args.module,
        },
      },
    });
  },
});
