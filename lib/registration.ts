import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getRegistrationSecret } from "./env";

export const REGISTRATION_COOKIE = "ebia_registration";
const TOKEN_TTL_SECONDS = 60 * 60 * 24;
export type RegistrationToken = { registrationId: string; landingSlug: string; createdAt: string; expiresAt: string; attribution: Record<string, string> };

function signature(payload: string) {
  const secret = getRegistrationSecret();
  if (!secret) throw new Error("REGISTRATION_TOKEN_SECRET no está configurado");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createRegistrationToken(landingSlug: string, attribution: Record<string, string>) {
  const createdAt = new Date();
  const data: RegistrationToken = { registrationId: randomUUID(), landingSlug, createdAt: createdAt.toISOString(), expiresAt: new Date(createdAt.getTime() + TOKEN_TTL_SECONDS * 1000).toISOString(), attribution };
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return { value: `${payload}.${signature(payload)}`, data, maxAge: TOKEN_TTL_SECONDS };
}

export function verifyRegistrationToken(value?: string | null): RegistrationToken | null {
  if (!value) return null;
  const [payload, provided] = value.split(".");
  if (!payload || !provided) return null;
  try {
    const expected = signature(payload);
    if (provided.length !== expected.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as RegistrationToken;
    return new Date(data.expiresAt).getTime() > Date.now() ? data : null;
  } catch { return null; }
}

export function sanitizeAttribution(input: Record<string, unknown>) {
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "placement", "landing_slug", "fbclid", "event_id"];
  return Object.fromEntries(allowed.flatMap((key) => { const value = input[key]; return typeof value === "string" && value.length <= 200 ? [[key, value.trim()]] : []; }));
}
