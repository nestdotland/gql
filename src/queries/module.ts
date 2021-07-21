import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const moduleQuery = queryField("module", {
  type: "Module",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
  },
  async resolve(_, args, ctx) {
    return checkNotFound(
      "Module",
      ctx.prisma.module.findUnique({
        where: {
          authorName_name: {
            authorName: args.author,
            name: args.module,
          },
        },
      })
    );
  },
});
