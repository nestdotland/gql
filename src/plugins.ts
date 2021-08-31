import { nullabilityGuardPlugin, queryComplexityPlugin } from "nexus";

const nullGuard = nullabilityGuardPlugin({
  onGuarded({ info }) {
    console.error(`Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}`);
  },
  fallbackValues: {
    Int: () => 0,
    String: () => "",
    Boolean: () => false,
    DateTime: () => new Date(),
    ID: () => "00000000-0000-0000-0000-000000000000",
  },
});

const complexity = queryComplexityPlugin();

export const plugins = [nullGuard, complexity];
