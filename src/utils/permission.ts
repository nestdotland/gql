export enum Keys {
  /* user */
  userRead,
  userWrite,
  /* module */
  moduleRead = 4,
  moduleWrite,
  modulePublish,
  /* private module */
  privateModuleRead = 8,
  privateModuleWrite,
  privateModulePublish,
}

export class Permissions {
  private bits: number;
  private length: number;

  constructor(bits: string) {
    this.bits = parseInt(bits, 2);
    this.length = bits.length;
  }

  get(key: keyof typeof Keys): boolean {
    const offset = Keys[key];
    const bit = this.bits & (2 ** offset);
    return !!bit;
  }

  set(key: keyof typeof Keys, value: boolean) {
    const offset = Keys[key];
    this.bits &= ~(2 ** offset * +value);
  }

  toString(): string {
    return this.bits.toString(2).padStart(this.length, "0");
  }
}
