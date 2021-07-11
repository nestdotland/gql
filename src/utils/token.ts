import crypto from "crypto";
import { PEPPER } from "./env";

export const prefix = "NEST_";

export function hashToken(token: string) {
  const invalidFormat = new Error("Invalid token format");
  if (!token.startsWith(prefix)) throw invalidFormat;
  const hex = token.substring(prefix.length);
  if (isNaN(parseInt(hex, 16))) throw invalidFormat;
  return hash(hex);
}

function hash(token: string) {
  return crypto.createHmac("sha256", PEPPER).update(token).digest("base64");
}

export function generateToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return {
    sha256: hash(token),
    token: `${prefix}${token.toUpperCase()}`,
  };
}
