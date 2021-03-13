import { arg, mutationField, mutationType, nonNull } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import type { Permission } from "@prisma/client";
import crypto from "crypto";
import { TagInput } from "./input_object_types";

type NameInput = {
  name: string;
};

type TagUpdateInput = {
  data: TagInput;
  where: NameInput;
};

type TagInput = {
  name: string;
  version: string;
};

type ContributorUpdateInput = {
  data: ContributorInput;
  where: NameInput;
};

type ContributorInput = {
  contributor: string;
  readModule?: boolean;
  writeModule?: boolean;
  readConfig?: boolean;
  writeConfig?: boolean;
};

function notNull<T>(arg: T | null | undefined): T | undefined {
  return arg === null ? undefined : arg;
}

function writeAccess(permission?: Permission): boolean {
  return permission === "WRITE" || permission === "READ_WRITE";
}

const pepper = process.env.PEPPER ?? "";

export const updateProfile = mutationField("updateProfile", {
  type: nonNull("User"),
  args: {
    data: nonNull(
      arg({
        type: "ProfileUpdateInput",
      })
    ),
  },
  resolve(_parent, args, ctx) {
    if (!writeAccess(ctx.accessToken.profile)) {
      throw new ForbiddenError("You are not allowed to edit user profile.");
    }
    return ctx.prisma.user.update({
      data: args.data,
      where: {
        name: ctx.accessToken.ownerName,
      },
    });
  },
});

export const updateAccessToken = mutationField("updateAccessToken", {
  type: nonNull("AccessToken"),
  args: {
    data: nonNull(
      arg({
        type: "AccessTokenUpdateInput",
      })
    ),
    where: nonNull(arg({ type: "NameInput" })),
  },
  async resolve(_parent, args, ctx) {
    if (!writeAccess(ctx.accessToken.accessTokens)) {
      throw new ForbiddenError("You are not allowed to edit access tokens.");
    }
    return ctx.prisma.accessToken.update({
      data: {
        name: notNull(args.data.name),
        accessTokens: notNull(args.data.accessTokens),
        versions: notNull(args.data.versions),
        configs: notNull(args.data.configs),
        privateVersions: notNull(args.data.privateVersions),
        privateConfigs: notNull(args.data.privateConfigs),
        privateContributions: notNull(args.data.privateContributions),
      },
      where: {
        ownerName_name: {
          ownerName: ctx.accessToken.ownerName,
          name: args.where.name,
        },
      },
    });
  },
});

export const createAccessToken = mutationField("createAccessToken", {
  type: nonNull("AccessToken"),
  args: {
    data: nonNull(
      arg({
        type: "AccessTokenCreateInput",
      })
    ),
  },
  async resolve(_parent, args, ctx) {
    if (!writeAccess(ctx.accessToken.accessTokens)) {
      throw new ForbiddenError("You are not allowed to add access tokens.");
    }
    const token = crypto.randomBytes(24).toString("hex");
    const accessToken = await ctx.prisma.accessToken.create({
      data: {
        name: args.data.name,
        tokenHash: crypto.createHmac("sha256", pepper).update(token).digest("base64"),
        accessTokens: args.data.accessTokens,
        versions: args.data.versions,
        configs: args.data.configs,
        privateVersions: args.data.privateVersions,
        privateConfigs: args.data.privateConfigs,
        privateContributions: args.data.privateContributions,
        owner: {
          connect: {
            name: ctx.accessToken.ownerName,
          },
        },
      },
    });
    return {
      ...accessToken,
      token,
    };
  },
});

export const deleteAccessToken = mutationField("deleteAccessToken", {
  type: nonNull("AccessToken"),
  args: {
    where: nonNull(
      arg({
        type: "NameInput",
      })
    ),
  },
  async resolve(_parent, args, ctx) {
    if (!writeAccess(ctx.accessToken.accessTokens)) {
      throw new ForbiddenError("You are not allowed to delete access tokens.");
    }
    const writeAccessTokens = await ctx.prisma.accessToken.findMany({
      where: {
        NOT: { name: args.where.name },
        owner: {
          name: ctx.accessToken.ownerName,
        },
        accessTokens: { in: ["WRITE", "READ_WRITE"] },
      },
    });
    if (writeAccessTokens.length === 0) {
      throw new Error("Cannot remove access token. At least one write access token is required.");
    }
    return ctx.prisma.accessToken.delete({
      where: {
        ownerName_name: {
          ownerName: ctx.accessToken.ownerName,
          name: args.where.name,
        },
      },
    });
  },
});

// TODO: write checks

export const upsertModule = mutationField("upsertModule", {
  type: nonNull("Module"),
  args: {
    data: nonNull(
      arg({
        type: "ModuleUpsertInput",
      })
    ),
    where: nonNull(arg({ type: "ModuleInput" })),
  },
  async resolve(_parent, args, ctx) {
    let authorName;
    // potential module contributor
    if (args.where.author && args.where.author !== ctx.accessToken.ownerName) {
      const module = await ctx.prisma.module.findUnique({
        where: {
          authorName_name: {
            authorName: args.where.author,
            name: args.where.name,
          },
        },
      });
      if (module === null) {
        throw new ForbiddenError(`Cannot create module on the behalf of user ${args.where.author}.`);
      }
      const permissions = await ctx.prisma.moduleContributor.findUnique({
        where: {
          authorName_moduleName_contributorName: {
            authorName: args.where.author,
            moduleName: args.where.name,
            contributorName: ctx.accessToken.ownerName,
          },
        },
      });
      if (!writeAccess(permissions?.config)) {
        throw new ForbiddenError("You are not allowed to edit this module configuration.");
      }
      if (!writeAccess(permissions?.contributors) && args.data.contributors && args.data.contributors?.length > 0) {
        throw new ForbiddenError("You are not allowed to edit contributors.");
      }
      authorName = args.where.author;
    } else {
      if (!writeAccess(ctx.accessToken.configs)) {
        throw new ForbiddenError("You are not allowed to edit this module configuration.");
      }
      authorName = ctx.accessToken.ownerName;
    }

    const authorName_moduleName = {
      authorName,
      moduleName: args.where.name,
    };

    const module = {
      fullName: args.data.fullName,
      description: args.data.description,
      homepage: args.data.homepage,
      repository: args.data.repository,
      issues: args.data.issues,
      license: args.data.license,
      private: args.data.private,
      unlisted: args.data.unlisted,
      ignore: notNull(args.data.ignore),
      keywords: notNull(args.data.keywords),
      main: args.data.main,
      bin: notNull(args.data.bin),
      logo: args.data.logo,
    };

    const tagUpdate = args.data.tags?.filter((input) => input.update).map((input) => input.update) as
      | TagUpdateInput[]
      | undefined;
    const tagCreate = args.data.tags?.filter((input) => input.create).map((input) => input.create) as
      | TagInput[]
      | undefined;
    const tagDelete = args.data.tags?.filter((input) => input.delete).map((input) => input.delete) as
      | NameInput[]
      | undefined;

    const contributorUpdate = args.data.contributors?.filter((input) => input.update) as
      | ContributorUpdateInput[]
      | undefined;
    const contributorCreate = args.data.contributors?.filter((input) => input.create) as ContributorInput[] | undefined;
    const contributorDelete = args.data.contributors?.filter((input) => input.delete) as NameInput[] | undefined;

    return ctx.prisma.module.upsert({
      where: {
        authorName_name: {
          authorName: ctx.accessToken.ownerName,
          name: args.where.name,
        },
      },
      create: {
        name: args.where.name,
        author: { connect: { name: ctx.accessToken.ownerName } },
        hooks: {
          create: { ...args.data.hooks },
        },
        ...module,
      },
      update: {
        hooks: {
          update: { ...args.data.hooks },
        },
        contributors: {
          update: contributorUpdate?.map(({ data, where }) => {
            return {
              where: {
                authorName_moduleName_contributorName: {
                  ...authorName_moduleName,
                  contributorName: where.name,
                },
              },
              data: {
                readModule: data.readModule,
                writeModule: data.writeModule,
                readConfig: data.readConfig,
                writeConfig: data.writeConfig,
                contributor: { connect: { name: "" } },
              },
            };
          }),
          create: contributorCreate?.map((input) => {
            return {
              readModule: input.readModule,
              writeModule: input.writeModule,
              readConfig: input.readConfig,
              writeConfig: input.writeConfig,
              contributor: { connect: { name: input.contributor } },
            };
          }),
          delete: contributorDelete?.map(({ name }) => {
            return {
              authorName_moduleName_contributorName: {
                ...authorName_moduleName,
                contributorName: name,
              },
            };
          }),
        },
        tags: {
          update: tagUpdate?.map(({ data, where }) => {
            return {
              where: {
                authorName_moduleName_name: {
                  ...authorName_moduleName,
                  name: where.name,
                },
              },
              data: {
                name: data.name,
                version: {
                  connect: {
                    authorName_moduleName_version: {
                      ...authorName_moduleName,
                      version: data.version,
                    },
                  },
                },
              },
            };
          }),
          create: tagCreate?.map((input) => {
            return {
              name: input.name,
              version: {
                connect: {
                  authorName_moduleName_version: {
                    ...authorName_moduleName,
                    version: input.version,
                  },
                },
              },
            };
          }),
          delete: tagDelete?.map(({ name }) => {
            return {
              authorName_moduleName_name: {
                ...authorName_moduleName,
                name,
              },
            };
          }),
        },
        ...module,
      },
    });
  },
});

export const Mutation = mutationType({
  definition(t) {
    // TODO: write authorization check

    // internal
    t.crud.createOneUser();
    t.crud.createOneModule();
    t.crud.createOneVersion();
  },
});
