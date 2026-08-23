import { SignJWT, jwtVerify } from "jose";
const COOKIE_NAME = "cs_admin_session";
const AGROPLANT_COOKIE_NAME = "cs_agroplant_session";
function getSecretKey() { const secret=process.env.AUTH_SECRET; if(!secret) throw new Error("AUTH_SECRET no está configurado en .env"); return new TextEncoder().encode(secret); }
export function getSessionCookieName(){return COOKIE_NAME;}
export function getAgroplantSessionCookieName(){return AGROPLANT_COOKIE_NAME;}
export async function signAdminSession(payload:{user:string}){return new SignJWT(payload).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(getSecretKey());}
export async function signAgroplantSession(payload:{user:string}){return new SignJWT({...payload,scope:"agroplant"}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("12h").sign(getSecretKey());}
export async function verifyAdminSession(token:string){const{payload}=await jwtVerify(token,getSecretKey());return payload as {user:string;iat:number;exp:number};}
export async function verifyAgroplantSession(token:string){const{payload}=await jwtVerify(token,getSecretKey());if(payload.scope!=="agroplant")throw new Error("Sesión no válida");return payload;}
