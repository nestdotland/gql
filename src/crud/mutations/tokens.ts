import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError } from "apollo-server-express";
import { writeAccess } from "../../utils/access";
import { notNull } from "../../utils/null";
import { generateToken } from "../../utils/token";

function noLogin(): never {
  throw new Error("You must get a session token to perform this action.");
}

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
    if (ctx.type === "login") noLogin();
    if (ctx.type !== "session" && !writeAccess(ctx.accessToken.accessTokens)) {
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
          ownerName: ctx.user,
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
    if (ctx.type === "login") noLogin();
    if (ctx.type !== "session" && !writeAccess(ctx.accessToken.accessTokens)) {
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
            name: ctx.user,
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
    if (ctx.type === "login") noLogin();
    if (ctx.type !== "session" && !writeAccess(ctx.accessToken.accessTokens)) {
      throw new ForbiddenError("You are not allowed to delete access tokens.");
    }
    return ctx.prisma.accessToken.delete({
      where: {
        ownerName_name: {
          ownerName: ctx.user,
          name: args.where.name,
        },
      },
    });
  },
});
