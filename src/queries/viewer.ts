import { nonNull, queryField } from "nexus";

export const viewerQuery = queryField("viewer", {
  type: nonNull("Viewer"),
  async resolve(_, _args, ctx) {
    const viewer = await ctx.prisma.user.findUnique({
      where: {
        name: ctx.username,
      },
    });
    return viewer!; // viewer is non null
  },
});
