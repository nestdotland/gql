import { ThirdPartyModule } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const ThirdPartyModuleOrderInput = createOrder({
  name: "ThirdPartyModule",
  members: [{
    value: "path",
  }],
});

export const ThirdPartyModuleType = objectType({
  ...setupObjectType(ThirdPartyModule),
  definition(t) {
    t.field(ThirdPartyModule.path);

    // t.model.host();
    // t.model.dependents(modelOptions);
  },
});
