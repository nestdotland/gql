import { queryType } from "nexus";

export const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users({
      ordering: true,
      filtering: true,
    });
    t.crud.module();
    t.crud.modules({
      ordering: true,
      filtering: true,
    });
  },
});
