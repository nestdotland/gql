import { nullabilityGuardPlugin, queryComplexityPlugin } from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";

const prisma = nexusPrisma({
  experimentalCRUD: true,
});

const nullGuard = nullabilityGuardPlugin({
  onGuarded({ info }) {
    console.error(`Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}`);
  },
  fallbackValues: {
    Permission: () => "NONE",
    Int: () => 0,
    String: () => "",
    Boolean: () => false,
    DateTime: () => new Date(),
  },
});

const complexity = queryComplexityPlugin();

export const plugins = [prisma, nullGuard, complexity];
