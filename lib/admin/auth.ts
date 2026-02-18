import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "admin_token";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
const TOKEN_VERSION = "v1";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw?.trim() || null;
}

function sessionSecret(password: string): string {
  return sha256(`admin-session:${password}`);
}

export function verifyPassword(password: string): boolean {
  const admin = getAdminPassword();
  if (!admin || !password) return false;
  return safeEqual(sha256(password), sha256(admin));
}

export function createSession(): string {
  const admin = getAdminPassword();
  if (!admin) throw new Error("ADMIN_PASSWORD not set");
  const iat = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(8).toString("hex");
  const payload = `${TOKEN_VERSION}.${iat}.${nonce}`;
  const sig = createHmac("sha256", sessionSecret(admin)).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token: string): boolean {
  const admin = getAdminPassword();
  if (!admin || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, iatRaw, nonce, sig] = parts;
  if (version !== TOKEN_VERSION || !iatRaw || !nonce || !sig) return false;
  const iat = parseInt(iatRaw, 10);
  if (!Number.isInteger(iat)) return false;
  const age = Math.floor(Date.now() / 1000) - iat;
  if (age < 0 || age > SESSION_TTL) return false;
  const payload = `${version}.${iatRaw}.${nonce}`;
  const expected = createHmac("sha256", sessionSecret(admin)).update(payload).digest("hex");
  return safeEqual(expected, sig);
}

export const SESSION_MAX_AGE = SESSION_TTL;
