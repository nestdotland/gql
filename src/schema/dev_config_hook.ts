import { DevConfigHook, HookKey, HookMode } from "nexus-prisma";
import { enumType, objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const DevConfigHookOrderInput = createOrder({
  name: "DevConfigHook",
  members: [{
    value: "key",
  }, {
    value: "mode",
  }, {
    value: "value",
  }, {
    value: "updatedAt",
    by: "update time",
  }],
});

export const HookModeEnum = enumType(HookMode);
export const HookKeyEnum = enumType(HookKey);

export const DevConfigHookType = objectType({
  ...setupObjectType(DevConfigHook),
  definition(t) {
    t.field(DevConfigHook.key);
    t.field(DevConfigHook.mode);
    t.field(DevConfigHook.value);
    t.field(DevConfigHook.updatedAt);

    // t.model.config();
  },
});
