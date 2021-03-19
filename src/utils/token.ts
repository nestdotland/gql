import crypto from "crypto";
import { deriveKeyFromPepper, getPepper } from "./pepper";
import { HASH } from "./crypto";

export function hashToken(token: Buffer) {
  return crypto.createHash("blake2b512").update(token);
}

export function generateToken() {
  const token = crypto.randomBytes(24);
  return {
    tokenHash: hashToken(token),
    token: token.toString("hex"),
  };
}
