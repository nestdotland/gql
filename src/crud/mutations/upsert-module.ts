import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import { notNull } from "../../utils/null";
import { ModulePermissions } from "../../utils/permission";

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
    const authorName = args.where.author ?? ctx.user;
    // potential module contributor
    if (authorName !== ctx.user) {
      const module = await ctx.prisma.module.findUnique({
        where: {
          authorName_name: {
            authorName,
            name: args.where.name,
          },
        },
      });
      if (module === null) {
        throw new ForbiddenError(`Cannot create module on the behalf of user ${args.where.author}.`);
      }
      const permissions = new ModulePermissions(ctx, {
        authorName,
        moduleName: args.where.name,
      });
      if (!(await permissions.config).canWrite) {
        throw new ForbiddenError("You are not allowed to edit this module configuration.");
      }
      if (args.data.contributors && args.data.contributors?.length > 0 && !(await permissions.contributors).canWrite) {
        throw new ForbiddenError("You are not allowed to edit contributors.");
      }
    } else {
      if (!ctx.permissions.configs.canWrite) {
        throw new ForbiddenError("You are not allowed to edit this module configuration.");
      }
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
          authorName,
          name: args.where.name,
        },
      },
      create: {
        name: args.where.name,
        author: { connect: { name: authorName } },
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
