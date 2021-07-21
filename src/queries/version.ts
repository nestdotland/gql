import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const versionQuery = queryField("version", {
  type: "Version",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
    version: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return checkNotFound(
      "Version",
      ctx.prisma.version.findUnique({
        where: {
          authorName_moduleName_name: {
            authorName: args.author,
            moduleName: args.module,
            name: args.version,
          },
        },
      })
    );
  },
});
