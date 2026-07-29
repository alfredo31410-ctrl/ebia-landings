const ALLOWED_ATTRIBUTION = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "campaign_id", "adset_id", "ad_id", "placement", "landing", "producto"]);
const HOTMART_HOSTS = new Set(["pay.hotmart.com", "checkout.hotmart.com", "hotmart.com"]);

export function getValidCheckoutUrl(value = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (HOTMART_HOSTS.has(url.hostname) || url.hostname.endsWith(".hotmart.com")) ? url : null;
  } catch { return null; }
}

export function buildCheckoutUrl(baseUrl: string, currentSearch = "") {
  const base = getValidCheckoutUrl(baseUrl);
  if (!base) return null;
  const incoming = new URLSearchParams(currentSearch);
  for (const [key, value] of incoming) if (ALLOWED_ATTRIBUTION.has(key)) base.searchParams.set(key, value);
  return base.toString();
}
