import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getRegistrationSecret, hasSafeRegistrationSecret } from "./env.ts";

export const REGISTRATION_COOKIE = "ebia_registration";
export const REGISTRATION_NONCE_COOKIE = "ebia_registration_nonce";
const TOKEN_TTL_SECONDS = 60 * 60 * 24;
const NONCE_TTL_SECONDS = 60 * 5;

export type RegistrationToken = { registrationId: string; landingSlug: string; createdAt: string; expiresAt: string; attribution: Record<string, string> };
export type RegistrationNonce = { nonce: string; landingSlug: string; issuedAt: string; expiresAt: string };
export type RegistrationNonceStatus = "valid" | "expired" | "wrong_landing" | "invalid";

function sign(payload: string) {
  if (!hasSafeRegistrationSecret()) throw new Error("REGISTRATION_TOKEN_SECRET no está configurado de forma segura");
  return createHmac("sha256", getRegistrationSecret()).update(payload).digest("base64url");
}

function encode<T>(data: T) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  const [payload, provided] = value.split(".");
  if (!payload || !provided) return null;
  try {
    const expected = sign(payload);
    if (provided.length !== expected.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch { return null; }
}

export function createRegistrationNonce(landingSlug: string) {
  const issuedAt = new Date();
  const data: RegistrationNonce = { nonce: randomUUID(), landingSlug, issuedAt: issuedAt.toISOString(), expiresAt: new Date(issuedAt.getTime() + NONCE_TTL_SECONDS * 1000).toISOString() };
  return { value: encode(data), data, maxAge: NONCE_TTL_SECONDS };
}

export function verifyRegistrationNonce(value: string | null | undefined, landingSlug: string) {
  const data = decode<RegistrationNonce>(value);
  return data && data.landingSlug === landingSlug && new Date(data.expiresAt).getTime() > Date.now() ? data : null;
}

export function getRegistrationNonceStatus(value: string | null | undefined, landingSlug: string): RegistrationNonceStatus {
  const data = decode<RegistrationNonce>(value);
  if (!data) return "invalid";
  if (data.landingSlug !== landingSlug) return "wrong_landing";
  return new Date(data.expiresAt).getTime() > Date.now() ? "valid" : "expired";
}

export function createRegistrationToken(landingSlug: string, attribution: Record<string, string>) {
  const createdAt = new Date();
  const data: RegistrationToken = { registrationId: randomUUID(), landingSlug, createdAt: createdAt.toISOString(), expiresAt: new Date(createdAt.getTime() + TOKEN_TTL_SECONDS * 1000).toISOString(), attribution };
  return { value: encode(data), data, maxAge: TOKEN_TTL_SECONDS };
}

export function verifyRegistrationToken(value?: string | null): RegistrationToken | null {
  const data = decode<RegistrationToken>(value);
  return data && new Date(data.expiresAt).getTime() > Date.now() ? data : null;
}

export function sanitizeAttribution(input: Record<string, unknown>) {
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "placement", "fbclid", "landing_slug", "event_id", "timestamp"];
  return Object.fromEntries(allowed.flatMap((key) => { const value = input[key]; return typeof value === "string" && value.trim().length <= 200 ? [[key, value.trim()]] : []; }));
}
