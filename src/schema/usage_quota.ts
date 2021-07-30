import { UsageQuota } from "nexus-prisma";
import { nonNull, objectType } from "nexus";
import { setupObjectType } from "../base";

export const UsageQuotaType = objectType({
  ...setupObjectType(UsageQuota),
  definition(t) {
    t.field({
      ...UsageQuota.api,
      type: nonNull("UsageQuotaApi"),
    });
    t.field(UsageQuota.publish);
  },
});
