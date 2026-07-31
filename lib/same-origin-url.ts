export const IA_NONCE_PATH = "/landings/ia-desde-cero/api/registrations/nonce";
export const IA_WHATSAPP_REDIRECT_PATH = "/landings/ia-desde-cero/api/whatsapp/redirect";

/** Construye endpoints del embudo en el host visible del navegador, nunca en el deployment técnico. */
export function getSameOriginUrl(path: string) {
  if (typeof window === "undefined") throw new Error("browser_required");
  const url = new URL(path, window.location.origin);
  if (url.origin !== window.location.origin) throw new Error("cross_origin_endpoint");
  return url.toString();
}
