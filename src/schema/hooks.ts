import { DevConfigHook, HookAction, HookPrefix } from "nexus-prisma";
import { enumType, objectType } from "nexus";

export function toHook(mode: string, key: string) {
  return `${mode}${key.replace(/^\w/, (s) => s.toUpperCase())}`;
}

export const DevConfigHookType = objectType({
  name: "Hooks",
  sourceType: "Map<string,string>",
  definition(t) {
    for (const prefix of HookPrefix.members) {
      for (const action of HookAction.members) {
        const hook = toHook(prefix, action);
        t.string(hook, {
          resolve(hooks) {
            return hooks.get(hook);
          },
        });
      }
    }
  },
});
