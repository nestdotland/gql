import { ApolloError } from "apollo-server-errors";

export async function checkNotFound<T>(type: string, resolver: Promise<T>): Promise<T> {
  const result = await resolver;
  if (result === null) throw new ApolloError(`${type} not found`, "NOT_FOUND");
  return result;
}
