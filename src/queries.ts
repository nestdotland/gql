import { queryType } from "nexus";

export const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users({
      ordering: true,
      filtering: true,
    });
    // TODO: 404 if private module
    t.crud.module();
    t.crud.modules({
      ordering: true,
      filtering: true,
      resolve(root, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.private = ctx.authorized
          ? {}
          : {
              equals: false,
            };
        return originalResolve(root, args, ctx, info);
      },
    });
    // TODO: 404 if private module
    t.crud.version();
    t.crud.versions({
      ordering: true,
      filtering: true,
      resolve(root, args, ctx, info, originalResolve) {
        args.where ??= {};
        args.where.module ??= {};
        args.where.module.private = ctx.authorized
          ? {}
          : {
              equals: false,
            };
        return originalResolve(root, args, ctx, info);
      },
    });
  },
});
