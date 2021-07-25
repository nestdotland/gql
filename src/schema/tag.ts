import { Tag } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";

export const TagOrderInput = createOrder({
  name: "Tag",
  members: [
    {
      value: "name",
    },
    {
      value: "createdAt",
      by: "creation time",
    },
    {
      value: "updatedAt",
      by: "update time",
    },
  ],
});

export const TagType = objectType({
  ...setupObjectType(Tag),
  definition(t) {
    t.field(Tag.name);
    t.field(Tag.createdAt);
    t.field(Tag.updatedAt);

    t.field(Tag.module);
    t.field(Tag.version);
    t.field({
      ...Tag.dependents,
      complexity,
      type: nonNull(list(nonNull("Version"))),
      args: baseArgs("Version"),
      resolve(tag, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            taggedDependencies: {
              some: {
                dependencyAuthor: { equals: tag.authorName },
                dependencyName: { equals: tag.moduleName },
                dependentVersion: { equals: tag.versionName },
                dependencyTag: { equals: tag.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
