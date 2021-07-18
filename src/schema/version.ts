import { Version } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const VersionOrderInput = createOrder({
  name: "Version",
  members: [{
    value: "name",
  }, {
    name: "PUBLISHER",
    value: "publisherName",
    by: "publisher name",
  }, {
    value: "createdAt",
    by: "creation time",
  }, {
    value: "updatedAt",
    by: "update time",
  }],
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

    // t.model.files(modelOptions);
    // t.model.tag(modelOptions);
    // t.model.module();
    // t.model.publisher();
    // t.model.dependents(modelOptions);
    // t.model.dependencies(modelOptions);
    // t.model.taggedDependencies(modelOptions);
    // t.model.thirdPartyDependencies(modelOptions);
  },
});
