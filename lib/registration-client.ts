export type RegistrationNonceResponse = { nonce: string; expiresAt: string };
import { getSameOriginUrl, IA_NONCE_PATH } from "./same-origin-url.ts";

// Centraliza la renovación para que montaje, recuperación y reintento no
// creen solicitudes de nonce duplicadas ni almacenen datos personales.
export async function requestRegistrationNonce(landing: string): Promise<RegistrationNonceResponse> {
  if (landing !== "ia-desde-cero") throw new Error("unsupported_landing");
  const response = await fetch(getSameOriginUrl(IA_NONCE_PATH), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landing }), cache: "no-store", credentials: "same-origin" });
  const body = await response.json().catch(() => ({})) as Partial<RegistrationNonceResponse> & { ok?: boolean };
  if (!response.ok || !body.ok || !body.nonce || !body.expiresAt) throw new Error("nonce_unavailable");
  return { nonce: body.nonce, expiresAt: body.expiresAt };
}
