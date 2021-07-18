import { File } from "nexus-prisma";
import { objectType } from "nexus";
import { baseArgs, createOrder, ordering, setupObjectType } from "../base";

export const UserOrderInput = createOrder({
  name: "User",
  members: [{
    value: "path",
  }, {
    value: "url",
  }, {
    value: "fullName",
    by: "full name",
  }, {
    value: "createdAt",
    by: "creation time",
  }],
});

export const FileType = objectType({
  ...setupObjectType(File),
  definition(t) {
    t.field(File.path);
    t.field(File.url);
    t.field(File.mimeType);
    t.field(File.createdAt);

    // t.model.version();
  },
});
