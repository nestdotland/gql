import { list, nonNull, queryField } from "nexus";
import { baseArgs, ordering, complexity } from "../base";

export const usersQuery = queryField("users", {
  type: nonNull(list(nonNull("User"))),
  args: baseArgs("User"),
  complexity,
  resolve(_, args, ctx) {
    return ctx.prisma.user.findMany({
      ...ordering(args),
    });
  },
});
