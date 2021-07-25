import { DevConfigHook, HookKey, HookMode } from "nexus-prisma";
import { enumType, objectType } from "nexus";

export function toHook(mode: string, key: string) {
  return `${mode}${key.replace(/^\w/, (s) => s.toUpperCase())}`;
}

export const DevConfigHookType = objectType({
  name: "Hooks",
  sourceType: "Map<string,string>",
  definition(t) {
    for (const mode of HookMode.members) {
      for (const key of HookKey.members) {
        const hook = toHook(mode, key);
        t.string(hook, {
          resolve(hooks) {
            return hooks.get(hook);
          },
        });
      }
    }
  },
});
