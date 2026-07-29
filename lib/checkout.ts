const ALLOWED_ATTRIBUTION = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "campaign_id", "adset_id", "ad_id", "placement", "landing", "producto"]);
const HOTMART_HOSTS = new Set(["pay.hotmart.com", "checkout.hotmart.com", "hotmart.com"]);
const REQUIRED_CHECKOUT = { off: "nzn1qn7n", checkoutMode: "10" };

export function getValidCheckoutUrl(value = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const validHost = HOTMART_HOSTS.has(url.hostname) || url.hostname.endsWith(".hotmart.com");
    const validOffer = url.hostname === "pay.hotmart.com" && url.pathname === "/Y106920957U" && url.searchParams.get("off") === REQUIRED_CHECKOUT.off && url.searchParams.get("checkoutMode") === REQUIRED_CHECKOUT.checkoutMode;
    return url.protocol === "https:" && validHost && validOffer ? url : null;
  } catch { return null; }
}

export function buildCheckoutUrl(baseUrl: string, currentSearch = "") {
  const base = getValidCheckoutUrl(baseUrl);
  if (!base) return null;
  const incoming = new URLSearchParams(currentSearch);
  for (const [key, value] of incoming) if (ALLOWED_ATTRIBUTION.has(key) && value.trim() && !base.searchParams.has(key)) base.searchParams.set(key, value);
  return base.toString();
}

export type DirectSalesPrice = { amount: number; currency: "MXN"; paymentLabel: string };

export function formatPrice(price: DirectSalesPrice) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(price.amount);
}
