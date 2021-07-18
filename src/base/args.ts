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
  after?: number;
  before?: number;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export function ordering(args: Args) {
  return {
    skip: args.after ?? args.before,
    take: args.take,
    orderBy: {
      [args?.orderBy.field ?? "id"]: args?.orderBy.direction ??
        (args.before === undefined ? "asc" : "desc"),
    },
  };
}
