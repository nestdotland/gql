import { nonNull, queryField, queryType } from "nexus";
import { hasRead, readAccess } from "../utils/access";
import { modelOptions } from "../utils/model";

// TODO(query): arweave URL to module / version

export const profile = queryField("profile", {
  type: nonNull("User"),
  async resolve(_parent, _args, ctx) {
    const profile = await ctx.prisma.user.findUnique({
      where: {
        name: ctx.accessToken.ownerName,
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
          if (authorName === ctx.accessToken.ownerName) return resolver();
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
              (contributor) => contributor.authorName === ctx.accessToken.ownerName && readAccess(contributor.config)
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
      resolve(root, args, ctx, info, originalResolve) {
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
                  config: hasRead,
                  contributor: {
                    name: { equals: ctx.accessToken.ownerName },
                  },
                },
              },
            },
            /* Author read access */
            {
              author: {
                accessTokens: {
                  some: {
                    tokenHash: { equals: ctx.accessToken.tokenHash },
                    privateConfigs: hasRead,
                  },
                },
              },
            },
          ],
        };
        return originalResolve(root, args, ctx, info);
      },
    });

    t.crud.version({
      async resolve(root, args, ctx, info, originalResolve) {
        const authorName = args.where?.authorName_moduleName_version?.authorName;
        const moduleName = args.where?.authorName_moduleName_version?.moduleName;
        const resolver = () => originalResolve(root, args, ctx, info);
        if (authorName && moduleName) {
          /* Module author */
          if (authorName === ctx.accessToken.ownerName) return resolver();
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
              (contributor) => contributor.authorName === ctx.accessToken.ownerName && readAccess(contributor.config)
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
                  config: hasRead,
                  contributor: {
                    name: { equals: ctx.accessToken.ownerName },
                  },
                },
              },
            },
            /* Author read access */
            {
              author: {
                accessTokens: {
                  some: {
                    tokenHash: { equals: ctx.accessToken.tokenHash },
                    privateConfigs: hasRead,
                  },
                },
              },
            },
          ],
        };
        return originalResolve(root, args, ctx, info);
      },
    });
  },
});
