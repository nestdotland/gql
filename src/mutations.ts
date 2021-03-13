import { arg, mutationType, nonNull } from "nexus";
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

const pepper = process.env.PEPPER ?? "";

export const Mutation = mutationType({
  definition(t) {
    // TODO: write authorization check

    // internal
    t.crud.createOneUser();
    t.crud.createOneModule();
    t.crud.createOneVersion();

    // user auth
    t.crud.upsertOneModule();
    t.crud.upsertOneTag();
    t.crud.deleteOneTag();

    t.nonNull.field("updateProfile", {
      type: "User",
      args: {
        data: nonNull(
          arg({
            type: "ProfileUpdateInput",
          })
        ),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.user.update({
          data: args.data,
          where: {
            name: ctx.accessToken.ownerName,
          },
        });
      },
    });

    t.nonNull.field("updateAccessToken", {
      type: "AccessToken",
      args: {
        data: nonNull(
          arg({
            type: "AccessTokenUpdateInput",
          })
        ),
        where: nonNull(arg({ type: "NameInput" })),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.accessToken.update({
          data: {
            name: notNull(args.data.name),
            readAccessTokens: notNull(args.data.readAccessTokens),
            writeAccessTokens: notNull(args.data.writeAccessTokens),
            readPrivateModules: notNull(args.data.readPrivateModules),
            readPrivateContributions: notNull(args.data.readPrivateContributions),
          },
          where: {
            name_ownerName: {
              ownerName: ctx.accessToken.ownerName,
              name: args.where.name,
            },
          },
        });
      },
    });

    t.nonNull.field("createAccessToken", {
      type: "AccessToken",
      args: {
        data: nonNull(
          arg({
            type: "AccessTokenCreateInput",
          })
        ),
      },
      async resolve(_parent, args, ctx) {
        const token = crypto.randomBytes(24).toString("hex");
        const accessToken = await ctx.prisma.accessToken.create({
          data: {
            name: args.data.name,
            tokenHash: crypto.createHmac("sha256", pepper).update(token).digest("base64"),
            readAccessTokens: notNull(args.data.readAccessTokens),
            writeAccessTokens: notNull(args.data.writeAccessTokens),
            readPrivateModules: notNull(args.data.readPrivateModules),
            readPrivateContributions: notNull(args.data.readPrivateContributions),
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

    // TODO: write checks

    t.nonNull.field("upsertModule", {
      type: "Module",
      args: {
        data: nonNull(
          arg({
            type: "ModuleUpsertInput",
          })
        ),
      },
      resolve(_parent, args, ctx) {
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

        const tagUpdate = args.data.tags?.filter((input) => input.update).map((input) => input.update) as TagUpdateInput[] | undefined;
        const tagCreate = args.data.tags?.filter((input) => input.create).map((input) => input.create) as TagInput[] | undefined;
        const tagDelete = args.data.tags?.filter((input) => input.delete).map((input) => input.delete) as NameInput[] | undefined;

        const contributorUpdate = args.data.contributors?.filter((input) => input.update) as
          | ContributorUpdateInput[]
          | undefined;
        const contributorCreate = args.data.contributors?.filter((input) => input.create) as
          | ContributorInput[]
          | undefined;
        const contributorDelete = args.data.contributors?.filter((input) => input.delete) as NameInput[] | undefined;

        return ctx.prisma.module.upsert({
          where: {
            authorName_name: {
              authorName: ctx.accessToken.ownerName,
              name: args.data.name,
            },
          },
          create: {
            name: args.data.name,
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
                      authorName: ctx.accessToken.ownerName,
                      moduleName: args.data.name,
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
                    authorName: ctx.accessToken.ownerName,
                    moduleName: args.data.name,
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
                      authorName: ctx.accessToken.ownerName,
                      moduleName: args.data.name,
                      name: where.name,
                    },
                  },
                  data: {
                    name: data.name,
                    version: {
                      connect: {
                        authorName_moduleName_version: {
                          authorName: ctx.accessToken.ownerName,
                          moduleName: args.data.name,
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
                        authorName: ctx.accessToken.ownerName,
                        moduleName: args.data.name,
                        version: input.version,
                      }
                    }
                  }
                }
              }),
              delete: tagDelete?.map(({ name }) => {
                return {
                  authorName_moduleName_name: {
                    authorName: ctx.accessToken.ownerName,
                    moduleName: args.data.name,
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
  },
});
