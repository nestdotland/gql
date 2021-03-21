import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError } from "apollo-server-express";
import { writeAccess } from "../utils/access";

export * from "./mutations/publish-version";
export * from "./mutations/upsert-module";
export * from "./mutations/tokens";

function noLogin(): never {
  throw new Error("You must get a session token to perform this action.");
}

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
    if (ctx.type === "login") noLogin();
    if (ctx.type !== "session" && !writeAccess(ctx.accessToken.accessProfile)) {
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
