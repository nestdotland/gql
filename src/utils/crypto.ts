import crypto from "crypto";
import hkdf from "futoin-hkdf";

export function timingSafeEqual (a: Buffer, b: Buffer): boolean {
  let longer = Math.max(a.length, b.length);
  let match = true;

  for (let i = 0; i < longer; i++) {
    if (a[i] !== b[i]) {
      match = false;
    }
  }

  return match;
}

export function encode(version: string, data: Buffer[]): string {
  let dataEncoded = data.map(x => x.toString("base64")).join(":");

  return `$${version}$${dataEncoded}$`;
}

export function decode(encoded: string): [string, Buffer[]] | undefined {
  if (!encoded.startsWith("$") || !encoded.endsWith("$")) return;
  let [version, data] = encoded.split("$", 4).slice(1, -1);

  let dataParts = data
    .split(":")
    .map(x => Buffer.from(x, "base64"));

  return [
    version,
    dataParts,
  ];
}

export const DEFAULT_HASH_VERSION = "hv0000";
export const HASHES = {
  "hv0000": {
    name: "blake2b512",
    outputLength: 64,
    impl: {
      hash (data: Buffer) {
        return crypto.createHash("blake2b512").update(data).digest();
      },
      hmac (key: Buffer, data: Buffer) {
        return crypto.createHmac("blake2b512", key).update(data).digest();
      },
      derive (key: Buffer, len: number, purpose: string) {
        return hkdf(key, len, { hash: "blake2b512", info: purpose });
      },
    }
  }
}
export const HASH = HASHES[DEFAULT_HASH_VERSION];

export const DEFAULT_CIPHER_VERSION = "cv0000";
export const CIPHERS = {
  "cv0000": {
    name: "chacha20",
    keyLength: 32,
    ivLength: 16,
    impl: {
      encrypt (key: Buffer, data: Buffer) {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("chacha20", key, iv);

        let ciphertext = cipher.update(data);
        cipher.final();

        return Buffer.concat(
          [iv, ciphertext],
          16 + ciphertext.length
        );
      },
      decrypt (key: Buffer, ciphertext: Buffer) {
        let iv = ciphertext.slice(0, 16);
        let decipher = crypto.createDecipheriv("chacha20", key, iv);

        let plaintext = decipher.update(ciphertext.slice(16));
        decipher.final();

        return plaintext;
      },
    }
  },
}
export const CIPHER = CIPHERS[DEFAULT_CIPHER_VERSION];

export const DEFAULT_PWHASH_VERSION = "pv0000";
export const PWHASHES = {
  "sha384:12000": {
    type: "pbkdf2",
    algorithm: "sha384",
    saltLength: 16,
    outputLength: 48,
    impl: {
      hash (password: string) {
        return Promise.resolve(null);
      },
      verify (password: string, salt: Buffer, hash: Buffer) {
        return new Promise((res, rej) => {
          if (!password.length || hash == null) return res(false);

          crypto.pbkdf2(password, salt, 12000, 48, "sha384", (err, output) => {
            if (err) return rej(err);

            let match = timingSafeEqual(output, hash);
            res(match);
          });
        });
      }
    }
  },
  "pv0000": {
    type: "scrypt",
    saltLength: 16,
    outputLength: 64,
    impl: {
      hash (password: string) {
        return new Promise((res, rej) => {
          if (!password.length) return rej(false);

          let salt = crypto.randomBytes(16);

          crypto.scrypt(password, salt, 64, { N: 2 ** 16, r: 8, p: 1 }, (err, output) => {
            if (err) return rej(err);

            res([salt, output]);
          });
        });
      },
      verify (password: string, salt: Buffer, hash: Buffer) {
        return new Promise((res, rej) => {
          if (!password.length || hash == null) return res(false);

          crypto.scrypt(password, salt, 64, { N: 2 ** 16, r: 8, p: 1 }, (err, output) => {
            if (err) return rej(err);

            let match = timingSafeEqual(output, hash);
            res(match);
          });
        });
      }
    }
  }
}
export const PWHASH = PWHASHES[DEFAULT_PWHASH_VERSION];