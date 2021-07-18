import { DevConfig } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const DevConfigOrderInput = createOrder({
  name: "DevConfig",
  members: [{
    value: "updatedAt",
    by: "update time",
  }],
});

export const DevConfigType = objectType({
  ...setupObjectType(DevConfig),
  definition(t) {
    t.field(DevConfig.ignore);
    t.field(DevConfig.updatedAt);

    // t.model.module();
    // t.model.hooks(modelOptions);
  },
});
