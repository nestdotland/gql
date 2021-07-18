import { nonNull, queryField } from "nexus";

export const viewerQuery = queryField("viewer", {
  type: nonNull("User"),
  resolve(_, _args, ctx) {
    return ctx.prisma.user.findUnique({
      where: {
        name: ctx.username,
      },
    });
  },
});
