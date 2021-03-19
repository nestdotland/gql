import fs from "fs";
import crypto from "crypto";
import { PEPPERS_FILE } from "./env";

import {
  HASHES, DEFAULT_HASH_VERSION,
  CIPHERS, DEFAULT_CIPHER_VERSION,
} from "./crypto";

export let PEPPERS: { [x: string]: Buffer } = {};
export let DEFAULT_PEPPER: string = "";

function decodeHex(hex: string): Buffer {
  return Buffer.from(hex, "hex");
}

/**
 * derive a key for a specific purpose (with optional maximum length) from a specified or default pepper
 * if specified pepper is outdated, also returns the updated version
 */
export function deriveKeyFromPepper(purpose: string, maxLength?: number): [Buffer, undefined]
export function deriveKeyFromPepper(purpose: string, maxLength?: number, pepperId?: string): [Buffer, Buffer | undefined]
export function deriveKeyFromPepper(purpose: string, maxLength: number = Infinity, pepperId?: string): [Buffer, Buffer | undefined] {
  let pepper = getPepper(pepperId); // get specified or default pepper

  let derivedKey = crypto
    .createHmac(HASH, purpose) // create a HMAC keyed with the purpose
    .update(pepper[0])
    .digest()
    .slice(0, maxLength); // slice down to maximum length

  let updatedKey = undefined;

  if (!pepper[1]) { // if pepper isn't up to date...
    updatedKey = deriveKeyFromPepper(purpose, maxLength)[0]; // ...calculate updated version
  }

  return [
    derivedKey, // derived key for specified pepper
    updatedKey, // if applicable, the updated key
  ];
}

/**
 * load peppers file (path specified in env variable), parse it and insert parsed values into global variables
 */
export function loadPeppersFile() {
  let fileContent = fs.readFileSync(PEPPERS_FILE, "utf8");

  let defaultPepper = undefined; // the default pepper has to be specified in the file
  let peppers = fileContent // the file is read and parsed
    .split(/\n|\r\n/g) // file is split into lines by splitting them at LF (Linux file ending) or CRLF (DOS/Windows file ending)
    .filter(line => line.length >= 3) // short (invalid) lines are skipped
    .map(line => { // lines are processed one by one...
      if (line.startsWith("default ")) { // special case for line specifying default
        defaultPepper = line.split("default ")[1];
        return null;
      } else {
        return line.split(" ", 2); // split lines into identifier and hexadecimal value
      }
    })
    .reduce((prev, curr) => { // flatten [key, value][] to object
      if (curr == null) return prev; // skip null values

      let [key, value] = curr;
      prev[key] = decodeHex(value); // decode hex string to Buffer

      return prev;
    }, {} as typeof PEPPERS);

  if (!defaultPepper) throw new Error("Default pepper was not specified in peppers file");
  if (!peppers[defaultPepper]) throw new Error("Default pepper does not exist in peppers file.");

  PEPPERS = peppers;
  DEFAULT_PEPPER = defaultPepper;

  return true;
}

/**
 * returns the specified or default pepper and whether it's up-to-date
 */
export function getPepper(id: string = DEFAULT_PEPPER): [Buffer, boolean] {
  return [
    PEPPERS[id], // requested pepper value
    id === DEFAULT_PEPPER, // true when the pepper is up-to-date, false otherwise
  ];
}

/**
 * encrypt data with default pepper
 */
export function encryptWithPepper(data: Buffer, purpose: string) {
  let iv = crypto.randomBytes(CIPHER_IV_LENGTH);
  let key = deriveKeyFromPepper(purpose, CIPHER_KEY_LENGTH)[0];

  let cipher = crypto.createCipheriv(CIPHER, key, iv);

  let head = cipher.update(data); // encrypted data
  let tail = cipher.final(); // not important with chacha20 but matters with block ciphers

  let ciphertext = Buffer.concat(
    [head, tail],
    head.length + tail.length
  );

  return `$${CIPHER}:${CIPHER_KEY_LENGTH}:${CIPHER_IV_LENGTH}`
}

if (Object.keys(PEPPERS).length === 0) loadPeppersFile(); // load peppers on startup