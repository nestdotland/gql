import { PublishConfig } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const PublishConfigOrderInput = createOrder({
  name: "PublishConfig",
  members: [
    {
      value: "updatedAt",
      by: "update time",
    },
  ],
});

export const PublishConfigType = objectType({
  ...setupObjectType(PublishConfig),
  definition(t) {
    t.field(PublishConfig.main);
    t.field(PublishConfig.bin);
    t.field(PublishConfig.lockfile);
    t.field(PublishConfig.importMap);
    t.field(PublishConfig.updatedAt);
  },
});
