export function notNull<T>(arg: T | null | undefined): T | undefined {
  return arg === null ? undefined : arg;
}
