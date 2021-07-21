import { AccessToken } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";
import { Permissions } from "../utils/permission";

export const AccessTokenOrderInput = createOrder({
  name: "AccessToken",
  members: [
    {
      value: "permissions",
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

export const AccessTokenType = objectType({
  ...setupObjectType(AccessToken),
  definition(t) {
    t.field(AccessToken.sha256);
    t.nonNull.int("permissionsInteger", {
      resolve(token) {
        return parseInt(token.permissions, 2);
      },
    });
    t.field(AccessToken.createdAt);
    t.field(AccessToken.updatedAt);
    t.nonNull.boolean("isUsed", {
      resolve(token, _args, ctx) {
        return token.sha256 === ctx.accessToken.sha256;
      },
    });
  },
});
