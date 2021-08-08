import { Engine } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const EngineOrderInput = createOrder({
  name: "Engine",
  members: [
    {
      value: "platform",
    },
    {
      value: "range",
    },
  ],
});

export const EngineType = objectType({
  ...setupObjectType(Engine),
  definition(t) {
    t.field(Engine.platform);
    t.field(Engine.range);
  },
});
