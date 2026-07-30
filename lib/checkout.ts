const DEFAULT_HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/Y106920957U?off=nzn1qn7n&checkoutMode=10";
const ALLOWED_ATTRIBUTION = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "campaign_id", "adset_id", "ad_id", "placement", "landing", "producto"]);

function isApprovedHotmartUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "pay.hotmart.com" && url.pathname === "/Y106920957U" && url.searchParams.get("off") === "nzn1qn7n" && url.searchParams.get("checkoutMode") === "10";
  } catch { return false; }
}

export function getCheckoutBaseUrl(value = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL) {
  const candidate = value?.trim() || DEFAULT_HOTMART_CHECKOUT_URL;
  return isApprovedHotmartUrl(candidate) ? new URL(candidate) : null;
}

export function buildCheckoutUrl(baseUrl = DEFAULT_HOTMART_CHECKOUT_URL, currentSearch = "") {
  const checkout = getCheckoutBaseUrl(baseUrl);
  if (!checkout) return null;
  const attribution = new URLSearchParams(currentSearch);
  for (const [key, value] of attribution) {
    if (ALLOWED_ATTRIBUTION.has(key) && value.trim() && !checkout.searchParams.has(key)) checkout.searchParams.set(key, value);
  }
  return checkout.toString();
}

export function formatPrice(price: { amount: number; currency: "MXN" }) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(price.amount);
}
