import { enumType, inputObjectType } from "nexus";
import type { AllInputTypes } from "nexus";

export const OrderDirectionEnum = enumType({
  name: "OrderDirection",
  description: "Possible directions in which to order a list of items when provided an `orderBy` argument.",
  members: [
    {
      name: "ASC",
      value: "asc",
      description: "Specifies an ascending order for a given `orderBy` argument.",
    },
    {
      name: "DESC",
      value: "desc",
      description: "Specifies a descending order for a given `orderBy` argument.",
    },
  ],
});

function camelToMacroCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

interface EnumTypeMember {
  name?: string;
  value: string;
  by?: string;
}

interface OrderField<S extends string> {
  name: S;
  pluralName?: string;
  members: EnumTypeMember[];
}

type ExtractOrder<S> = S extends `${infer T}OrderField` ? T : never;
export type OrderLike = ExtractOrder<AllInputTypes>;

export function createOrder<S extends OrderLike>(field: OrderField<S>) {
  const plural = field.pluralName ?? `${field.name.toLowerCase()}s`;
  const orderField = enumType({
    name: `${field.name}OrderField`,
    description: `Properties by which ${plural} connections can be ordered.`,
    members: field.members.map((member) => ({
      name: member.name ?? camelToMacroCase(member.value),
      value: member.value,
      description: `Order ${plural} by ${member.by ?? member.value}`,
    })),
  });
  const input = inputObjectType({
    name: `${field.name}Order`,
    definition(t) {
      t.nonNull.field("direction", { type: "OrderDirection" });
      t.nonNull.field("field", { type: `${field.name}OrderField` });
    },
  });
  return {
    [`${field.name}OrderFieldEnum`]: orderField,
    [`${field.name}OrderInput`]: input,
  };
}
