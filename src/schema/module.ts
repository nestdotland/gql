import { Module } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import {
  baseArgs,
  complexity,
  createOrder,
  ordering,
  setupObjectType,
} from "../base";

export const ModuleOrderInput = createOrder({
  name: "Module",
  members: [{
    value: "name",
  }, {
    value: "fullName",
    by: "full name",
  }, {
    value: "createdAt",
    by: "creation time",
  }, {
    value: "updatedAt",
    by: "update time",
  }],
});

export const ModuleType = objectType({
  ...setupObjectType(Module),
  definition(t) {
    t.field(Module.name);
    t.field(Module.fullName);
    t.field(Module.description);
    t.field(Module.homepage);
    t.field(Module.repository);
    t.field(Module.bugs);
    t.field(Module.funding);
    t.field(Module.license);
    t.field(Module.logo);
    t.field(Module.keywords);
    t.field(Module.verified);
    t.field(Module.malicious);
    t.field(Module.private);
    t.field(Module.unlisted);
    t.field(Module.createdAt);
    t.field(Module.updatedAt);

    t.field(Module.author);
    t.field(Module.publishConfig);
    t.field(Module.devConfig);
    t.field({
      ...Module.versions,
      complexity,
      args: baseArgs("Version"),
      async resolve(module, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            authorName: { equals: module.authorName },
            moduleName: { equals: module.name },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Module.tags,
      complexity,
      args: baseArgs("Tag"),
      async resolve(module, args, ctx) {
        return ctx.prisma.tag.findMany({
          where: {
            authorName: { equals: module.authorName },
            moduleName: { equals: module.name },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Module.contributors,
      complexity,
      type: nonNull(list(nonNull("User"))),
      args: baseArgs("User"),
      async resolve(module, args, ctx) {
        return ctx.prisma.user.findMany({
          where: {
            contributions: {
              some: {
                moduleAuthor: { equals: module.authorName },
                moduleName: { equals: module.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
