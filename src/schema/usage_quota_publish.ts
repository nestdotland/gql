import { UsageQuotaPublish } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const UsageQuotaPublishType = objectType({
  ...setupObjectType(UsageQuotaPublish),
  definition(t) {
    t.field(UsageQuotaPublish.limit);
    t.nonNull.int("remaining", {
      resolve(user) {
        return Math.max(0, user.limit - user.used);
      },
    });
    t.field(UsageQuotaPublish.used);
    t.field(UsageQuotaPublish.size);
    t.field(UsageQuotaPublish.private);
    t.field(UsageQuotaPublish.reset);

    // t.model.quota();
  },
});
