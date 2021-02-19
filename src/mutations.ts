import { mutationType } from "nexus";

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    // t.crud.updateOneUser()
    t.crud.deleteOneUser();
    t.crud.createOneModule();
    // t.crud.updateOneModule()
    t.crud.deleteOneModule();
    t.crud.createOneVersion();
    // t.crud.updateOneVersion()
    t.crud.deleteOneVersion();
    t.crud.createOneTag();
    // t.crud.updateOneTag()
    t.crud.deleteOneTag();
  },
});
