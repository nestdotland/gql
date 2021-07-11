import { enumType, objectType } from "nexus";
// import { readAccess } from "../utils/access";
import { modelOptions } from "../utils/model";

function equalsFalse(bool: boolean) {
  return bool ? {} : { equals: false };
}

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.name();
    t.model.avatar();
    t.model.bio();
    t.model.funding();
    t.model.verified();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.modules(modelOptions);
    t.model.publications(modelOptions);
    t.model.contributions(modelOptions);
    t.model.usageQuota();
    t.model.accessTokens(modelOptions);
  },
});

export const Module = objectType({
  name: "Module",
  definition(t) {
    t.model.id();
    t.model.authorName(); 
    t.model.name();
    t.model.fullName();
    t.model.description();
    t.model.homepage();
    t.model.repository();
    t.model.bugs();
    t.model.funding();
    t.model.license();
    t.model.logo();
    t.model.keywords();
    t.model.verified();
    t.model.malicious();
    t.model.private();
    t.model.unlisted();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.versions(modelOptions);
    t.model.contributors(modelOptions);
    t.model.author();
    t.model.tags(modelOptions);
    t.model.publishConfig();
    t.model.devConfig();
  },
});

export const Version = objectType({
  name: "Version",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.name();
    t.model.publisherName();
    t.model.deprecated();
    t.model.vulnerable();
    t.model.unlisted();
    t.model.supportedDeno();
    t.model.main();
    t.model.bin();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.files(modelOptions);
    t.model.tag(modelOptions);
    t.model.module();
    t.model.publisher();
    t.model.dependents(modelOptions);
    t.model.dependencies(modelOptions);
    t.model.taggedDependencies(modelOptions);
    t.model.thirdPartyDependencies(modelOptions);
  },
});

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.name();
    t.model.versionName();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.module();
    t.model.version();
    t.model.dependents(modelOptions);
  },
});

export const File = objectType({
  name: "File",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.versionName();
    t.model.path();
    t.model.url();
    t.model.mimeType();
    t.model.createdAt();

    t.model.version();
  },
});

export const PublishConfig = objectType({
  name: "PublishConfig",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.main();
    t.model.bin();
    t.model.lockfile();
    t.model.importMap();
    t.model.updatedAt();

    t.model.module();
  },
});

export const DevConfig = objectType({
  name: "DevConfig",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.ignore();
    t.model.updatedAt();

    t.model.module();
    t.model.hooks(modelOptions);
  },
});

export const DevConfigHook = objectType({
  name: "DevConfigHook",
  definition(t) {
    t.model.id();
    t.model.authorName();
    t.model.moduleName();
    t.model.key();
    t.model.value();
    t.model.updatedAt();

    t.model.config();
  },
});

export const UsageQuota = objectType({
  name: "UsageQuota",
  definition(t) {
    t.model.id();
    t.model.username();

    t.model.user();
    t.model.api();
    t.model.publish();
  },
});

export const UsageQuotaApi = objectType({
  name: "UsageQuotaApi",
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.limit();
    t.model.used();
    t.model.remaining();
    t.model.reset();

    t.model.quota();
  },
});

export const UsageQuotaPublish = objectType({
  name: "UsageQuotaPublish",
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.limit();
    t.model.used();
    t.model.remaining();
    t.model.size();
    t.model.private();
    t.model.reset();

    t.model.quota();
  },
});

export const DependencyGraph = objectType({
  name: "DependencyGraph",
  definition(t) {
    t.model.id();
    t.model.dependentAuthor();
    t.model.dependentName();
    t.model.dependentVersion();
    t.model.dependencyAuthor();
    t.model.dependencyName();
    t.model.dependencyVersion();

    t.model.dependent();
    t.model.dependency();
  },
});

export const TaggedDependencyGraph = objectType({
  name: "TaggedDependencyGraph",
  definition(t) {
    t.model.id();
    t.model.dependentAuthor();
    t.model.dependentName();
    t.model.dependentVersion();
    t.model.dependencyAuthor();
    t.model.dependencyName();
    t.model.dependencyTag();

    t.model.dependent();
    t.model.dependency();
  },
});

export const ThirdPartyModule = objectType({
  name: "ThirdPartyModule",
  definition(t) {
    t.model.id();
    t.model.hostname();
    t.model.path();

    t.model.host();
    t.model.dependents(modelOptions);
  },
});

export const ThirdPartyHost = objectType({
  name: "ThirdPartyHost",
  definition(t) {
    t.model.id();
    t.model.hostname();
    t.model.verified();

    t.model.modules(modelOptions);
  },
});

export const ThirdPartyDependencyGraph = objectType({
  name: "ThirdPartyDependencyGraph",
  definition(t) {
    t.model.id();
    t.model.dependentAuthor();
    t.model.dependentName();
    t.model.dependentVersion();
    t.model.dependencyHost();
    t.model.dependencyPath();

    t.model.dependent();
    t.model.dependency();
  },
});

export const Contribution = objectType({
  name: "Contribution",
  definition(t) {
    t.model.id();
    t.model.contributorName();
    t.model.moduleAuthor();
    t.model.moduleName();

    t.model.contributor();
    t.model.module();
  },
});

export const AccessToken = objectType({
  name: "AccessToken",
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.sha256();
    t.model.permissions();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.user();
  },
});
