import { list, nonNull, queryField } from "nexus";
import { baseArgs, ordering, complexity } from "../base";

export const usersQuery = queryField("teams", {
  type: nonNull(list(nonNull("Team"))),
  args: baseArgs("Team"),
  complexity,
  resolve(_, args, ctx) {
    return ctx.prisma.team.findMany({
      ...ordering(args),
    });
  },
});
