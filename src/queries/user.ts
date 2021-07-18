import { nonNull, queryField, stringArg } from "nexus";

export const userQuery = queryField("user", {
  type: "User",
  args: {
    name: nonNull(stringArg())
  },
  resolve(_, args, ctx) {
    return ctx.prisma.user.findUnique({
      where: {
        name: args.name,
      },
    });
  },
});
