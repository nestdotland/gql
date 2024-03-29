import { User } from "nexus-prisma";
import { list, nonNull, objectType, interfaceType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";

export const UserOrderInput = createOrder({
  name: "User",
  members: [
    {
      value: "name",
    },
    {
      value: "fullName",
      by: "full name",
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

export const UserType = interfaceType({
  ...setupObjectType(User),
  // should be optional => fallback to default
  resolveType() {
    return null;
  },
  definition(t) {
    t.field(User.name);
    t.field(User.fullName);
    t.field(User.avatar);
    t.field(User.bio);
    t.field(User.funding);
    t.field(User.verified);
    t.field(User.createdAt);
    t.field(User.updatedAt);

    t.field({
      ...User.modules,
      complexity,
      args: baseArgs("Module"),
      resolve(user, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            authorName: { equals: user.name },
            private: ctx.username === user.name && ctx.permissions.get("privateModuleRead") ? {} : { equals: false },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.publications,
      complexity,
      args: baseArgs("Version"),
      resolve(user, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            publisher: {
              name: { equals: user.name },
            },
            module: {
              private: ctx.username === user.name && ctx.permissions.get("privateModuleRead") ? {} : { equals: false },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.contributions,
      complexity,
      type: nonNull(list(nonNull("Module"))),
      args: baseArgs("Module"),
      resolve(user, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            contributors: {
              some: {
                contributorName: { equals: user.name },
              },
            },
            private: ctx.username === user.name && ctx.permissions.get("privateModuleRead") ? {} : { equals: false },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.teams,
      complexity,
      type: nonNull(list(nonNull("Team"))),
      args: baseArgs("Team"),
      resolve(user, args, ctx) {
        return ctx.prisma.team.findMany({
          where: {
            members: {
              some: {
                memberName: { equals: user.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.createdTeams,
      complexity,
      type: nonNull(list(nonNull("Team"))),
      args: baseArgs("Team"),
      resolve(user, args, ctx) {
        return ctx.prisma.team.findMany({
          where: {
            ownerName: { equals: user.name },
          },
          ...ordering(args),
        });
      },
    });
  },
});
