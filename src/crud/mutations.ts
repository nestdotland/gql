import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError } from "apollo-server-express";

export * from "./mutations/publish-version";
export * from "./mutations/upsert-module";
export * from "./mutations/tokens";

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
    if (!ctx.permissions.profile.canWrite) {
      throw new ForbiddenError("You are not allowed to edit user profile.");
    }
    return ctx.prisma.user.update({
      data: args.data,
      where: {
        name: ctx.user,
      },
    });
  },
});
