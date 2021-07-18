import { User } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import {
  baseArgs,
  complexity,
  createOrder,
  ordering,
  setupObjectType,
} from "../base";

export const UserOrderInput = createOrder({
  name: "User",
  members: [{
    value: "name",
  }, {
    value: "fullName",
    by: "full name",
  }, {
    value: "createdAt",
    by: "creation time",
  }, {
    value: "updatedAt",
    by: "update time",
  }],
});

export const UserType = objectType({
  ...setupObjectType(User),
  definition(t) {
    t.field(User.name);
    t.field(User.fullName);
    t.field(User.avatar);
    t.field(User.bio);
    t.field(User.funding);
    t.field(User.verified);
    t.field(User.createdAt);
    t.field(User.updatedAt);

    t.field(User.usageQuota);
    t.field({
      ...User.modules,
      complexity,
      args: baseArgs("Module"),
      async resolve(user, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            authorName: { equals: user.name },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.publications,
      complexity,
      args: baseArgs("Version"),
      async resolve(user, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            publisher: {
              name: { equals: user.name },
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
      async resolve(user, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            contributors: {
              some: {
                contributorName: { equals: user.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...User.accessTokens,
      complexity,
      args: baseArgs("AccessToken"),
      async resolve(user, args, ctx) {
        return ctx.prisma.accessToken.findMany({
          where: {
            username: { equals: user.name },
          },
          ...ordering(args),
        });
      },
    });
  },
});
