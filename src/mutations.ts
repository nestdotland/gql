import { arg, mutationType, nonNull, stringArg } from "nexus";
import crypto from "crypto";

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
    t.crud.updateOneUser();
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
      resolve: (_parent, args, ctx) => {
        return ctx.prisma.user.update({
          data: {
            fullName: args.data.fullName,
            bioText: args.data.bioText,
            email: args.data.email,
          },
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
        tokenName: nonNull(stringArg()),
      },
      resolve: (_parent, args, ctx) => {
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
              name: args.tokenName,
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
  },
});
