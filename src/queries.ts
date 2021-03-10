import { queryType } from "nexus";

export const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users({
      ordering: true,
      filtering: true,
    });
    t.crud.module();
    t.crud.modules({
      ordering: true,
      filtering: true,
      resolve(root, args, ctx, info, originalResolve) {
        args.where = {
          ...args.where,
          OR: [
            {
              private: {
                equals: false,
              },
            },
            {
              author: {
                accessTokens: {
                  some: {
                    AND: [{ moduleScope: { has: "READ" } }, { token: { equals: ctx.accessToken.token } }],
                  },
                },
              },
              private: {
                equals: true,
              },
            },
          ],
        };
        return originalResolve(root, args, ctx, info);
      },
    });
    t.crud.version();
    t.crud.versions({
      ordering: true,
      filtering: true,
      resolve(root, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module = {
          ...args.where.module,
          OR: [
            {
              private: {
                equals: false,
              },
            },
            {
              author: {
                accessTokens: {
                  some: {
                    AND: [{ moduleScope: { has: "READ" } }, { token: { equals: ctx.accessToken.token } }],
                  },
                },
              },
              private: {
                equals: true,
              },
            },
          ],
        };
        return originalResolve(root, args, ctx, info);
      },
    });
  },
});
