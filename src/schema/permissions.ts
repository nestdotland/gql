import { objectType } from "nexus";
import { Keys } from "../utils/permission";

export const PermissionsType = objectType({
  name: "Permissions",
  sourceType: {
    module: `${__dirname}/../utils/permission.ts`,
    export: "Permissions",
  },
  definition(t) {
    for (const key in Keys) {
      if (isNaN(parseInt(key))) {
        t.nonNull.boolean(key, {
          resolve(permissions) {
            return permissions.get(key as keyof typeof Keys);
          },
        });
      }
    }
  },
});
