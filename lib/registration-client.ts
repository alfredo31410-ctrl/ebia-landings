export type RegistrationNonceResponse = { nonce: string; expiresAt: string };

// Centraliza la renovación para que montaje, recuperación y reintento no
// creen solicitudes de nonce duplicadas ni almacenen datos personales.
export async function requestRegistrationNonce(landing: string): Promise<RegistrationNonceResponse> {
  const response = await fetch("/api/registrations/nonce", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landing }), cache: "no-store" });
  const body = await response.json().catch(() => ({})) as Partial<RegistrationNonceResponse> & { ok?: boolean };
  if (!response.ok || !body.ok || !body.nonce || !body.expiresAt) throw new Error("nonce_unavailable");
  return { nonce: body.nonce, expiresAt: body.expiresAt };
}
