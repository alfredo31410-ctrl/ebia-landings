export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "campaign_id",
  "adset_id",
  "ad_id",
  "placement",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number] | "event_id", string>>;

const STORAGE_KEY = "ebia:attribution:ia-maestros";
export const ATTRIBUTION_COOKIE = "ebia_attribution_ia_maestros";

function safeStoredAttribution(): Attribution {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

export function captureAttribution(): Attribution {
  const stored = safeStoredAttribution();
  const search = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = search.get(key)?.trim();
      return value ? [[key, value.slice(0, 200)]] : [];
    }),
  ) as Attribution;

  const attribution: Attribution = {
    ...stored,
    ...current,
    event_id:
      stored.event_id ||
      (typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`),
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // El registro debe seguir funcionando si el navegador bloquea storage.
  }
  return attribution;
}

export function persistAttributionCookie() {
  const attribution = captureAttribution();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(attribution))}; Path=/; Max-Age=1800; SameSite=Lax${secure}`;
  return attribution;
}
