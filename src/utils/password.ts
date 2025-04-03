import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

interface VerifyPasswordParameters {
  input: string;
  storedHash: string;
}

const scryptAsync = promisify(scrypt);

/**
 * Hashes a password using scrypt.
 * @param password - The password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string) => {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);

  if (!(derived instanceof Buffer)) {
    throw new TypeError('scrypt did not return a Buffer');
  }

  return `${salt.toString('hex')}:${derived.toString('hex')}`;
};

/**
 * Verifies a password against a stored hash.
 * @param params - The parameters for the function.
 * @param params.input - The password to verify.
 * @param params.storedHash - The stored hash to verify against.
 * @returns `true` if the password matches the hash, `false` otherwise.
 */
export const verifyPassword = async ({
  input,
  storedHash,
}: VerifyPasswordParameters) => {
  const [saltHex, keyHex] = storedHash.split(':');

  if (!saltHex || !keyHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const realKey = Buffer.from(keyHex, 'hex');
  const derived = await scryptAsync(input, salt, 64);

  if (!(derived instanceof Buffer)) {
    throw new TypeError('scrypt did not return a Buffer');
  }

  return derived.equals(realKey);
};
