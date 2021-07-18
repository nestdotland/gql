import { Module } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

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
  },
});