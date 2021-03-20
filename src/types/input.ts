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

// **** Access Token ****

export const AccessTokenCreateInput = inputObjectType({
  name: "AccessTokenCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.field("accessTokens", { type: "Permission" });
    t.nonNull.field("versions", { type: "Permission" });
    t.nonNull.field("configs", { type: "Permission" });
    t.nonNull.field("privateVersions", { type: "Permission" });
    t.nonNull.field("privateConfigs", { type: "Permission" });
    t.nonNull.field("privateContributions", { type: "Permission" });
  },
});

export const AccessTokenUpdateInput = inputObjectType({
  name: "AccessTokenUpdateInput",
  definition(t) {
    t.string("name");
    t.field("accessTokens", { type: "Permission" });
    t.field("versions", { type: "Permission" });
    t.field("configs", { type: "Permission" });
    t.field("privateVersions", { type: "Permission" });
    t.field("privateConfigs", { type: "Permission" });
    t.field("privateContributions", { type: "Permission" });
  },
});

// **** Module ****

export const ModuleInput = inputObjectType({
  name: "ModuleInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("author");
  },
});

export const ModuleUpsertInput = inputObjectType({
  name: "ModuleUpsertInput",
  definition(t) {
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
    t.nonNull.field("version", { type: "Permission" });
    t.nonNull.field("config", { type: "Permission" });
    t.nonNull.field("contributors", { type: "Permission" });
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

// **** Version ****

export const VersionInput = inputObjectType({
  name: "VersionInput",
  definition(t) {
    t.nonNull.string("version");
    t.nonNull.date("published");
    t.boolean("deprecated");
    t.boolean("vulnerable");
    t.list.nonNull.string("supportedDeno");
    t.string("main");
    t.list.nonNull.string("bin");
    t.string("logo");
    t.nonNull.string("module");
    t.string("author");
    t.nonNull.list.nonNull.field("files", { type: "FileInput" });
  },
});

export const FileInput = inputObjectType({
  name: "FileInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("path");
    t.nonNull.string("type");
    t.nonNull.string("hash");
    t.nonNull.string("txID");
  },
});
