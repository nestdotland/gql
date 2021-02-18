import { arg, nonNull, objectType } from "nexus";

export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.field("addUser", {
      type: "User",
      args: {
        data: nonNull(
          arg({
            type: "UserCreateInput",
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.user.create({
          data: {
            name: args.data.name,
            fullName: args.data.fullName,
            bioText: args.data.bioText,
            email: args.data.email,
          },
        });
      },
    });
  },
});
