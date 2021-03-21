import { nonNull, queryField, queryType } from "nexus";
import { Context } from "../context";
import { NexusGenInputs } from "../generated/nexus";
import { modelOptions } from "../utils/model";
import { generateToken } from "../utils/token";
import { ModulePermissions } from "../utils/permission";

// TODO(query): arweave URL to module / version

export const login = queryField("login", {
  type: "Session",
  async resolve(_parent, _args, ctx) {
    if (ctx.permissions.isLogin) {
      // TODO(@blob): add password functions
      const { token, tokenHash } = generateToken();
      const session = await ctx.prisma.session.create({
        data: {
          token: {
            create: {
              tokenHash,
            },
          },
          user: {
            connect: {
              name: ctx.user,
            },
          },
        },
      });
      return {
        ...session,
        plainToken: token,
      };
    } else throw new Error("Cannot access login query in this state.");
  },
});

export const profile = queryField("profile", {
  type: nonNull("User"),
  async resolve(_parent, _args, ctx) {
    const profile = await ctx.prisma.user.findUnique({
      where: {
        name: ctx.user,
      },
    });
    return profile!; // user is non null
  },
});

export const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users(modelOptions);

    t.crud.module({
      async resolve(root, args, ctx, info, originalResolve) {
        const authorName = args.where?.authorName_name?.authorName;
        const moduleName = args.where?.authorName_name?.name;
        const resolver = () => originalResolve(root, args, ctx, info);
        return checkModulePermissions(ctx, resolver, authorName, moduleName);
      },
    });

    t.crud.modules({
      ...modelOptions,
      async resolve(parent, args, ctx, info, originalResolve) {
        args.where = {
          ...args.where,
          OR: moduleWhereInput(ctx),
        };
        return originalResolve(parent, args, ctx, info);
      },
    });

    t.crud.version({
      async resolve(root, args, ctx, info, originalResolve) {
        const authorName = args.where?.authorName_moduleName_version?.authorName;
        const moduleName = args.where?.authorName_moduleName_version?.moduleName;
        const resolver = () => originalResolve(root, args, ctx, info);
        return checkModulePermissions(ctx, resolver, authorName, moduleName);
      },
    });

    t.crud.versions({
      ...modelOptions,
      resolve(root, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module = {
          ...args.where.module,
          OR: moduleWhereInput(ctx),
        };
        return originalResolve(root, args, ctx, info);
      },
    });
  },
});

async function checkModulePermissions<T>(ctx: Context, resolver: () => T, authorName?: string, moduleName?: string) {
  if (authorName && moduleName) {
    /* Module author */
    if (authorName === ctx.user) return resolver();
    const module = await ctx.prisma.module.findUnique({
      where: {
        authorName_name: {
          authorName,
          name: moduleName,
        },
      },
      select: {
        private: true,
      },
    });
    /* Public module */
    if (module?.private === false) return resolver();
    const permissions = new ModulePermissions(ctx, {
      authorName,
      moduleName,
    });
    /* Module contributor */
    if ((await permissions.config).canRead) return resolver();
  }
  /* Unauthorized */
  return null;
}

function moduleWhereInput(ctx: Context): NexusGenInputs["ModuleWhereInput"][] {
  return [
    /* Public module */
    {
      private: { equals: false },
    },
    /* Contributor read access */
    {
      contributors: {
        some: {
          accessConfig: ctx.permissions.hasRead,
          contributor: {
            name: { equals: ctx.user },
          },
        },
      },
    },
    /* Author read access */
    {
      author: {
        accessTokens: {
          some: {
            tokenHash: { equals: ctx.token.hash },
            accessPrivateConfigs: ctx.permissions.hasRead,
          },
        },
      },
    },
    /* Session */
    {
      author: {
        sessions: {
          some: {
            tokenHash: { equals: ctx.token.hash },
          },
        },
      },
    },
  ];
}
