import { Version } from "nexus-prisma";
import { list, nonNull, objectType } from "nexus";
import { baseArgs, complexity, createOrder, ordering, setupObjectType } from "../base";

export const VersionOrderInput = createOrder({
  name: "Version",
  members: [
    {
      value: "name",
    },
    {
      name: "PUBLISHER",
      value: "publisherName",
      by: "publisher name",
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

export const VersionType = objectType({
  ...setupObjectType(Version),
  definition(t) {
    t.field(Version.name);
    t.field(Version.deprecated);
    t.field(Version.vulnerable);
    t.field(Version.unlisted);
    t.field(Version.supportedDeno);
    t.field(Version.main);
    t.field(Version.bin);
    t.field(Version.lockfile);
    t.field(Version.importMap);
    t.field(Version.createdAt);
    t.field(Version.updatedAt);

    t.field(Version.module);
    t.field(Version.publisher);
    t.field({
      ...Version.files,
      complexity,
      args: baseArgs("File"),
      resolve(version, args, ctx) {
        return ctx.prisma.file.findMany({
          where: {
            authorName: { equals: version.authorName },
            moduleName: { equals: version.moduleName },
            versionName: { equals: version.name },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Version.tags,
      complexity,
      args: baseArgs("Tag"),
      resolve(version, args, ctx) {
        return ctx.prisma.tag.findMany({
          where: {
            authorName: { equals: version.authorName },
            moduleName: { equals: version.moduleName },
            versionName: { equals: version.name },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Version.dependents,
      complexity,
      type: nonNull(list(nonNull("Version"))),
      args: baseArgs("Version"),
      resolve(version, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            dependencies: {
              some: {
                dependencyAuthor: { equals: version.authorName },
                dependencyName: { equals: version.moduleName },
                dependencyVersion: { equals: version.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Version.dependencies,
      complexity,
      type: nonNull(list(nonNull("Version"))),
      args: baseArgs("Version"),
      resolve(version, args, ctx) {
        return ctx.prisma.version.findMany({
          where: {
            dependents: {
              some: {
                dependentAuthor: { equals: version.authorName },
                dependentName: { equals: version.moduleName },
                dependentVersion: { equals: version.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Version.taggedDependencies,
      complexity,
      type: nonNull(list(nonNull("Tag"))),
      args: baseArgs("Tag"),
      resolve(version, args, ctx) {
        return ctx.prisma.tag.findMany({
          where: {
            dependents: {
              some: {
                dependentAuthor: { equals: version.authorName },
                dependentName: { equals: version.moduleName },
                dependentVersion: { equals: version.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
    t.field({
      ...Version.thirdPartyDependencies,
      complexity,
      type: nonNull(list(nonNull("ThirdPartyModule"))),
      args: baseArgs("ThirdPartyModule"),
      resolve(version, args, ctx) {
        return ctx.prisma.thirdPartyModule.findMany({
          where: {
            dependents: {
              some: {
                dependentAuthor: { equals: version.authorName },
                dependentName: { equals: version.moduleName },
                dependentVersion: { equals: version.name },
              },
            },
          },
          ...ordering(args),
        });
      },
    });
  },
});
