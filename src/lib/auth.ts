import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "cs_admin_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET no está configurado en .env");
  return new TextEncoder().encode(secret);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export async function signAdminSession(payload: { user: string }) {
  const key = getSecretKey();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  return token;
}

export async function verifyAdminSession(token: string) {
  const key = getSecretKey();
  const { payload } = await jwtVerify(token, key);
  return payload as { user: string; iat: number; exp: number };
}