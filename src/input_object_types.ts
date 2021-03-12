import { inputObjectType } from "nexus";

export const NameInput = inputObjectType({
  name: "NameInput",
  definition(t) {
    t.nonNull.string("name");
  },
});

export const ProfileUpdateInput = inputObjectType({
  name: "ProfileUpdateInput",
  definition(t) {
    t.string("fullName");
    t.string("bioText");
    t.string("email");
  },
});

export const AccessTokenCreateInput = inputObjectType({
  name: "AccessTokenCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.boolean("readAccessTokens");
    t.boolean("writeAccessTokens");
    t.boolean("readPrivateModules");
    t.boolean("readPrivateContributions");
  },
});

export const AccessTokenUpdateInput = inputObjectType({
  name: "AccessTokenUpdateInput",
  definition(t) {
    t.string("name");
    t.boolean("readAccessTokens");
    t.boolean("writeAccessTokens");
    t.boolean("readPrivateModules");
    t.boolean("readPrivateContributions");
  },
});

export const ModuleUpsertInput = inputObjectType({
  name: "ModuleUpsertInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fullName");
    t.string("description");
    t.string("homepage");
    t.string("repository");
    t.string("issues");
    t.string("license");
    t.boolean("private");
    t.boolean("unlisted");
    t.string("ignore");
    t.list.nonNull.string("keywords");
    t.string("main");
    t.list.nonNull.string("bin");
    t.string("logo");
    t.list.nonNull.field("contributors", { type: "ContributorMutationInput" });
    t.list.nonNull.field("tags", { type: "TagMutationInput" });
    t.field("hooks", { type: "HooksInput" });
  },
});

// **** Contributor ****

export const ContributorMutationInput = inputObjectType({
  name: "ContributorMutationInput",
  definition(t) {
    t.field("update", { type: "ContributorUpdateInput" });
    t.field("create", { type: "ContributorInput" });
    t.field("delete", { type: "NameInput" });
  },
});

export const ContributorUpdateInput = inputObjectType({
  name: "ContributorUpdateInput",
  definition(t) {
    t.nonNull.field("where", { type: "NameInput" });
    t.nonNull.field("data", { type: "ContributorInput" });
  },
});

export const ContributorInput = inputObjectType({
  name: "ContributorInput",
  definition(t) {
    t.nonNull.string("contributor");
    t.boolean("readModule");
    t.boolean("writeModule");
    t.boolean("readConfig");
    t.boolean("writeConfig");
  },
});

// **** Tag ****

export const TagMutationInput = inputObjectType({
  name: "TagMutationInput",
  definition(t) {
    t.field("update", { type: "TagUpdateInput" });
    t.field("create", { type: "TagInput" });
    t.field("delete", { type: "NameInput" });
  },
});

export const TagUpdateInput = inputObjectType({
  name: "TagUpdateInput",
  definition(t) {
    t.nonNull.field("where", { type: "NameInput" });
    t.nonNull.field("data", { type: "TagInput" });
  },
});

export const TagInput = inputObjectType({
  name: "TagInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("version");
  },
});

// **** Hooks ****

export const HooksInput = inputObjectType({
  name: "HooksInput",
  definition(t) {
    t.string("presync");
    t.string("postsync");
    t.string("prepublish");
    t.string("postpublish");
  },
});
