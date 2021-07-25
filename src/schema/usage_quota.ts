import { UsageQuota } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const UsageQuotaType = objectType({
  ...setupObjectType(UsageQuota),
  definition(t) {
    t.field(UsageQuota.api);
    t.field(UsageQuota.publish);
  },
});
