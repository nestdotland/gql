import { nonNull, queryField, stringArg } from "nexus";
import { checkNotFound } from "../base";

export const userQuery = queryField("team", {
  type: "Team",
  args: {
    name: nonNull(stringArg()),
    owner: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    return checkNotFound(
      "Team",
      ctx.prisma.team.findUnique({
        where: {
          ownerName_name: {
            name: args.name,
            ownerName: args.owner,
          },
        },
      })
    );
  },
});
