import { nullabilityGuardPlugin, queryComplexityPlugin } from "nexus";

const nullGuard = nullabilityGuardPlugin({
  onGuarded({ info }) {
    console.error(`Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}`);
  },
  fallbackValues: {
    // Permission: () => "NONE",
    Int: () => 0,
    String: () => "",
    Boolean: () => false,
    DateTime: () => new Date(),
  },
});

const complexity = queryComplexityPlugin();

export const plugins = [nullGuard, complexity];
