import { nonNull, queryField } from "nexus";

export const profile = queryField("viewer", {
  type: nonNull("User"),
  resolve(_parent, _args, ctx) {
    return ctx.prisma.user.findUnique({
      where: {
        name: ctx.username,
      },
    });
  },
});
