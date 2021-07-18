import { UsageQuotaApi } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const UsageQuotaApiType = objectType({
  ...setupObjectType(UsageQuotaApi),
  definition(t) {
    t.field(UsageQuotaApi.limit);
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.field(UsageQuotaApi.used);
    t.field(UsageQuotaApi.reset);

    // t.model.quota();
  },
});
