import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const userQuery = queryField("user", {
  type: "User",
  args: {
    name: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return checkNotFound(
      "User",
      ctx.prisma.user.findUnique({
        where: {
          name: args.name,
        },
      })
    );
  },
});
