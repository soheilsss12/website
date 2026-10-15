import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PASSWORD_HASH_BYTES = 64;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, PASSWORD_HASH_BYTES);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPassword(password, encodedHash) {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') return false;
  const [algorithm, saltHex, expectedHex] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/i.test(saltHex || '') || !/^[a-f0-9]{128}$/i.test(expectedHex || '')) return false;

  try {
    const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), PASSWORD_HASH_BYTES);
    const expected = Buffer.from(expectedHex, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function newOpaqueToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function parseCookies(header = '') {
  const cookies = new Map();
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator <= 0) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!key) continue;
    try {
      cookies.set(key, decodeURIComponent(value));
    } catch {
      cookies.set(key, value);
    }
  }
  return cookies;
}
