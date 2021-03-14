import type { Permission } from "@prisma/client";

export function readAccess(permission?: Permission): boolean {
  return permission === "READ" || permission === "READ_WRITE";
}

export function writeAccess(permission?: Permission): boolean {
  return permission === "WRITE" || permission === "READ_WRITE";
}

export const hasRead = { in: ["READ", "READ_WRITE"] as ["READ", "READ_WRITE"] };
