import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import { TagInput } from "../types/input";
import { writeAccess } from "../utils/access";
import { generateToken } from "../utils/token";

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
    if (!writeAccess(ctx.accessToken.accessProfile)) {
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
        accessVersions: notNull(args.data.versions),
        accessConfigs: notNull(args.data.configs),
        accessPrivateVersions: notNull(args.data.privateVersions),
        accessPrivateConfigs: notNull(args.data.privateConfigs),
        accessPrivateContributions: notNull(args.data.privateContributions),
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
    const { token, tokenHash } = generateToken();
    const accessToken = await ctx.prisma.accessToken.create({
      data: {
        name: args.data.name,
        tokenHash,
        accessTokens: args.data.accessTokens,
        accessVersions: args.data.versions,
        accessConfigs: args.data.configs,
        accessPrivateVersions: args.data.privateVersions,
        accessPrivateConfigs: args.data.privateConfigs,
        accessPrivateContributions: args.data.privateContributions,
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
      if (!writeAccess(permissions?.accessConfig)) {
        throw new ForbiddenError("You are not allowed to edit this module configuration.");
      }
      if (
        !writeAccess(permissions?.accessContributors) &&
        args.data.contributors &&
        args.data.contributors?.length > 0
      ) {
        throw new ForbiddenError("You are not allowed to edit contributors.");
      }
      authorName = args.where.author;
    } else {
      if (!writeAccess(ctx.accessToken.accessConfigs)) {
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
      | null
      | undefined;
    const tagCreate = args.data.tags?.filter((input) => input.create).map((input) => input.create) as
      | TagInput[]
      | null
      | undefined;
    const tagDelete = args.data.tags?.filter((input) => input.delete).map((input) => input.delete) as
      | NameInput[]
      | null
      | undefined;

    if (tagCreate != undefined) {
      for (const input of tagCreate) {
        const version = await ctx.prisma.version.findUnique({
          where: {
            authorName_moduleName_version: {
              ...authorName_moduleName,
              version: input.version,
            },
          },
        });
        if (version === null) {
          throw new UserInputError(`Tag creation: Couldn't find version ${input.version}`);
        }
      }
    }

    const contributorUpdate = args.data.contributors?.filter((input) => input.update) as
      | ContributorUpdateInput[]
      | null
      | undefined;
    const contributorCreate = args.data.contributors?.filter((input) => input.create) as
      | ContributorInput[]
      | null
      | undefined;
    const contributorDelete = args.data.contributors?.filter((input) => input.delete) as NameInput[] | null | undefined;

    if (contributorCreate != undefined) {
      for (const input of contributorCreate) {
        const version = await ctx.prisma.user.findUnique({
          where: {
            name: input.contributor,
          },
        });
        if (version === null) {
          throw new UserInputError(`Contributor creation: Couldn't find user ${input.contributor}`);
        }
      }
    }

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
