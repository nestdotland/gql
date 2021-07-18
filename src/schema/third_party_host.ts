import { ThirdPartyHost } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const ThirdPartyHostOrderInput = createOrder({
  name: "ThirdPartyHost",
  members: [{
    value: "hostname",
  }],
});

export const ThirdPartyHostType = objectType({
  ...setupObjectType(ThirdPartyHost),
  definition(t) {
    t.field(ThirdPartyHost.hostname);
    t.field(ThirdPartyHost.verified);
  },
});
