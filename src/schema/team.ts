import { Team } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";

export const TeamOrderInput = createOrder({
  name: "Team",
  members: [
    {
      value: "name",
    },
    {
      value: "createdAt",
      by: "creation time",
    },
    {
      value: "updatedAt",
      by: "update time",
    },
  ],
});

export const TeamType = objectType({
  ...setupObjectType(Team),
  definition(t) {
    t.field(Team.name);
    t.field(Team.createdAt);
    t.field(Team.updatedAt);

    t.field(Team.owner);
    t.field({
      ...Team.members,
      complexity,
      type: nonNull(list(nonNull("User"))),
      args: baseArgs("User"),
      resolve(team, args, ctx) {
        return ctx.prisma.user.findMany({
          where: {
            teams: {
              some: {
                teamName: { equals: team.name },
                teamOwner: { equals: team.ownerName },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Team.modules,
      complexity,
      type: nonNull(list(nonNull("Module"))),
      args: baseArgs("Module"),
      resolve(team, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            teams: {
              some: {
                teamName: { equals: team.name },
                teamOwner: { equals: team.ownerName },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
