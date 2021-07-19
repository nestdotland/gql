import { nonNull, queryField, stringArg } from "nexus";

export const tagQuery = queryField("tag", {
  type: "Tag",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
    tag: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return ctx.prisma.tag.findUnique({
      where: {
        authorName_moduleName_name: {
          authorName: args.author,
          moduleName: args.module,
          name: args.tag,
        },
      },
    });
  },
});
