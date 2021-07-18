import { Tag } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const UserOrderInput = createOrder({
  name: "User",
  members: [{
    value: "name",
  }, {
    value: "createdAt",
    by: "creation time",
  }, {
    value: "updatedAt",
    by: "update time",
  }],
});

export const TagType = objectType({
  ...setupObjectType(Tag),
  definition(t) {
    t.field(Tag.name);
    t.field(Tag.createdAt);
    t.field(Tag.updatedAt);

    // t.model.module();
    // t.model.version();
    // t.model.dependents(modelOptions);
  },
});
