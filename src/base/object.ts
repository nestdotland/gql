interface $$Type<T extends string> {
  $name: T;
  $description?: string;
}

export function setupObjectType<T extends string>(type: $$Type<T>) {
  return {
    name: type.$name,
    description: type.$description,
    sourceType: {
      module: "@prisma/client",
      export: type.$name,
    },
  };
}
