import { arg, intArg, nonNull } from "nexus";
import type { OrderLike } from "./order";

export function baseArgs<S extends OrderLike>(name: S) {
  return {
    take: nonNull(intArg()),
    after: intArg(),
    before: intArg(),
    orderBy: arg({ type: `${name}Order` }),
  };
}

interface Args {
  take: number;
  after?: number | null;
  before?: number | null;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  } | null;
}

export function ordering(args: Args) {
  return {
    skip: args.after ?? args.before ?? undefined,
    take: args.take,
    orderBy: {
      [args?.orderBy?.field ?? "id"]: args?.orderBy?.direction ?? (args.before === undefined ? "asc" : "desc"),
    },
  };
}

interface ComplexityInput {
  args: Args;
  childComplexity: number;
}

export function complexity({ args, childComplexity }: ComplexityInput) {
  return (args?.take ?? 1) * childComplexity;
}
