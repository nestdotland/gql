import { nonNull, queryField, queryType } from "nexus";
import { hasRead, readAccess } from "../utils/access";
import { modelOptions } from "../utils/model";
import { generateToken } from "../utils/token";

// TODO(query): arweave URL to module / version

function noLogin(): never {
  throw new Error("You must get a session token to perform this action.");
}

export const login = queryField("login", {
  type: "Session",
  async resolve(_parent, _args, ctx) {
    if (ctx.type === "login") {
      const { token, tokenHash } = generateToken();
      const session = await ctx.prisma.session.create({
        data: {
          tokenHash,
          user: {
            connect: {
              name: ctx.user,
            },
          },
        },
      });
      return {
        ...session,
        token,
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
        const name = args.where?.authorName_name?.name;
        const resolver = () => originalResolve(root, args, ctx, info);
        if (authorName && name) {
          /* Module author */
          if (authorName === ctx.user) return resolver();
          const module = await ctx.prisma.module.findUnique({
            where: {
              authorName_name: {
                authorName,
                name,
              },
            },
            select: {
              private: true,
              contributors: true,
            },
          });
          if (module !== null) {
            /* Public module */
            if (module.private === false) return resolver();
            const readPermission = module.contributors.some(
              (contributor) => contributor.authorName === ctx.user && readAccess(contributor.accessConfig)
            );
            /* Module contributor */
            if (readPermission) return resolver();
          }
        }
        /* Unauthorized */
        return null;
      },
    });

    t.crud.modules({
      ...modelOptions,
      async resolve(parent, args, ctx, info, originalResolve) {
        args.where = {
          ...args.where,
          OR: [
            /* Public module */
            {
              private: { equals: false },
            },
            /* Contributor read access */
            {
              contributors: {
                some: {
                  accessConfig: hasRead,
                  contributor: {
                    name: { equals: ctx.user },
                  },
                },
              },
            },
            /* Author read access */
            ctx.type === "token"
              ? {
                  author: {
                    accessTokens: {
                      some: {
                        tokenHash: { equals: ctx.accessToken.tokenHash },
                        accessPrivateConfigs: hasRead,
                      },
                    },
                  },
                }
              : ctx.type === "session"
              ? {
                  author: {
                    sessions: {
                      some: {
                        tokenHash: { equals: ctx.session.tokenHash },
                      },
                    },
                  },
                }
              : noLogin(),
          ],
        };
        return originalResolve(parent, args, ctx, info);
      },
    });

    t.crud.version({
      async resolve(root, args, ctx, info, originalResolve) {
        const authorName = args.where?.authorName_moduleName_version?.authorName;
        const moduleName = args.where?.authorName_moduleName_version?.moduleName;
        const resolver = () => originalResolve(root, args, ctx, info);
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
              contributors: true,
            },
          });
          if (module !== null) {
            /* Public module */
            if (module.private === false) return resolver();
            const readPermission = module.contributors.some(
              (contributor) => contributor.authorName === ctx.user && readAccess(contributor.accessConfig)
            );
            /* Module contributor */
            if (readPermission) return resolver();
          }
        }
        /* Unauthorized */
        return null;
      },
    });

    t.crud.versions({
      ...modelOptions,
      resolve(root, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module = {
          ...args.where.module,
          OR: [
            /* Public module */
            {
              private: { equals: false },
            },
            /* Contributor read access */
            {
              contributors: {
                some: {
                  accessConfig: hasRead,
                  contributor: {
                    name: { equals: ctx.user },
                  },
                },
              },
            },
            /* Author read access */
            ctx.type === "token"
              ? {
                  author: {
                    accessTokens: {
                      some: {
                        tokenHash: { equals: ctx.accessToken.tokenHash },
                        accessPrivateConfigs: hasRead,
                      },
                    },
                  },
                }
              : ctx.type === "session"
              ? {
                  author: {
                    sessions: {
                      some: {
                        tokenHash: { equals: ctx.session.tokenHash },
                      },
                    },
                  },
                }
              : noLogin(),
          ],
        };
        return originalResolve(root, args, ctx, info);
      },
    });
  },
});
