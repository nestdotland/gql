import crypto from "crypto";
import { PEPPER } from "./env";

export function hashToken(token: string) {
  return crypto.createHmac("sha256", PEPPER).update(token).digest("base64");
}

export function generateToken() {
  const token = crypto.randomBytes(24).toString("hex");
  return {
    tokenHash: hashToken(token),
    token,
  };
}
