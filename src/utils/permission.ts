import type { AccessToken } from "@prisma/client";

const keys = {
  userRead: 0,
  userWrite: 0,
  moduleRead: 0,
  moduleWrite: 0,
  modulePublish: 0,
  privateModuleRead: 0,
  privateModuleWrite: 0,
  privateModulePublish: 0,
};

export class Permissions {
  private bits: number
  private length: number;

  constructor(bits: string) {
    this.bits = parseInt(bits, 2);
    this.length = bits.length;
  }

  get(key: keyof typeof keys): boolean {
    const offset = keys[key];
    const bit = this.bits & (2 << offset);
    return !!bit;
  }

  set(key: keyof typeof keys, value: boolean) {
    const offset = keys[key];
    this.bits &= ~ ((2 << offset) * (+value));
  }

  toString(): string {
    return this.bits.toString(2).padStart(this.length, "0");
  }
}
