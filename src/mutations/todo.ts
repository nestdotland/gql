import { mutationField, nonNull, stringArg } from "nexus";

export const todoMutation = mutationField("todo", {
  type: nonNull("String"),
  args: {
    data: nonNull(stringArg()),
  },
  resolve(_, args) {
    return args.data;
  },
});
