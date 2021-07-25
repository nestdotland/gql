import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const tagQuery = queryField("tag", {
  type: "Tag",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
    tag: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return checkNotFound(
      "Tag",
      ctx.prisma.tag.findUnique({
        where: {
          authorName_moduleName_name: {
            authorName: args.author,
            moduleName: args.module,
            name: args.tag,
          },
        },
      })
    );
  },
});
