import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const fileQuery = queryField("file", {
  type: "File",
  args: {
    author: nonNull(stringArg()),
    module: nonNull(stringArg()),
    version: nonNull(stringArg()),
    path: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return checkNotFound(
      "File",
      ctx.prisma.file.findUnique({
        where: {
          authorName_moduleName_versionName_path: {
            authorName: args.author,
            moduleName: args.module,
            versionName: args.version,
            path: args.path,
          },
        },
      })
    );
  },
});
