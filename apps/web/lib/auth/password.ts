import crypto from "crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "abroadmate-production-session-auth-sec-389f4178a9c2b4d1e89f0274c3e5a6b8";

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

/**
 * Hashes a plaintext password using crypto.scrypt with a unique cryptographically secure salt.
 * Output format: scrypt$hexSalt$hexDerivedKey
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      {
        cost: SCRYPT_COST,
        blockSize: SCRYPT_BLOCK_SIZE,
        parallelization: SCRYPT_PARALLELIZATION,
      },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`scrypt$${salt}$${derivedKey.toString("hex")}`);
      }
    );
  });
}

/**
 * Verifies a plaintext password against a stored scrypt hash using timingSafeEqual to prevent timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split("$");
      if (parts.length !== 3 || parts[0] !== "scrypt" || !parts[1] || !parts[2]) {
        return resolve(false);
      }
      const salt = parts[1];
      const expectedHex = parts[2];
      const expectedKey = Buffer.from(expectedHex, "hex");

      crypto.scrypt(
        password,
        salt,
        SCRYPT_KEYLEN,
        {
          cost: SCRYPT_COST,
          blockSize: SCRYPT_BLOCK_SIZE,
          parallelization: SCRYPT_PARALLELIZATION,
        },
        (err, derivedKey) => {
          if (err) return resolve(false);
          try {
            resolve(crypto.timingSafeEqual(expectedKey, derivedKey));
          } catch {
            resolve(false);
          }
        }
      );
    } catch {
      resolve(false);
    }
  });
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Signs a session payload using HMAC-SHA256 with the server's SESSION_SECRET.
 * Cookie format: <base64url(payload)>.<signature>
 */
export function signSessionToken(payload: Omit<SessionPayload, "exp">, expiresInSeconds: number = 7 * 24 * 60 * 60): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 session token and returns the payload if valid and not expired.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(payloadB64).digest("base64url");
    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSig);

    if (sigBuffer.length !== expectedSigBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < nowInSeconds) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
