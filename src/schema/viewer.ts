import { User, Tier } from "nexus-prisma";
import { objectType, nonNull, FieldResolver, enumType } from "nexus";
import { baseArgs, complexity, ordering, setupObjectType } from "../base";

import { UserType } from "./user";

export const TierEnum = enumType(Tier);

export const ViewerType = objectType({
  ...setupObjectType(User),
  name: "Viewer",
  definition(t) {
    t.implements(UserType);
    t.field({
      ...User.tier,
      resolve: (User.tier.resolve as unknown) as FieldResolver<"Viewer", "tier">,
    });

    t.field({
      ...User.usageQuota,
      type: nonNull("UsageQuota"),
      resolve(user, args, ctx, info) {
        return User.usageQuota.resolve(user, args, ctx, info);
      },
    });
    t.field({
      ...User.accessTokens,
      complexity,
      args: baseArgs("AccessToken"),
      resolve(user, args, ctx) {
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
