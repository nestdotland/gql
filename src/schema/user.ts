import { User } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

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

    t.field({
      ...User.modules,
      args: baseArgs("Module"),
      async resolve(src, args, ctx) {
        return ctx.prisma.module.findMany({
          where: {
            author: {
              id: { equals: src.id },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
