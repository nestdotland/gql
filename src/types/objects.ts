import { objectType } from "nexus";

export const Stats = objectType({
  name: "Stats",
  definition(t) {
    t.nonNull.field("module", { type: "ModuleStats" });
    t.nonNull.field("user", { type: "UserStats" });
  },
});

export const ModuleStats = objectType({
  name: "ModuleStats",
  definition(t) {
    t.nonNull.int("visible", {
      resolve(_root, _args, ctx) {
        return ctx.prisma.module.count({
          where: {
            unlisted: false,
            private: false,
          },
        });
      },
    });
    t.nonNull.int("public", {
      resolve(_root, _args, ctx) {
        return ctx.prisma.module.count({
          where: {
            private: false,
          },
        });
      },
    });
    t.nonNull.int("all", {
      resolve(_root, _args, ctx) {
        return ctx.prisma.module.count();
      },
    });
  },
});

export const UserStats = objectType({
  name: "UserStats",
  definition(t) {
    t.nonNull.int("all", {
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.count();
      },
    });
  },
});
