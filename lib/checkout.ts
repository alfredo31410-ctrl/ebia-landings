const DEFAULT_HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/Y106920957U?off=nzn1qn7n&checkoutMode=10";
const DEFAULT_IA_MAESTROS_CHECKOUT_URL =
  "https://pay.hotmart.com/M107670322C?off=f4a0vm6y&checkoutMode=10";
const ALLOWED_ATTRIBUTION = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "campaign_id", "adset_id", "ad_id", "placement", "landing", "producto"]);

function isApprovedHotmartUrl(
  value: string,
  expected: { pathname: string; offer: string },
) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "pay.hotmart.com" &&
      url.pathname === expected.pathname &&
      url.searchParams.get("off") === expected.offer &&
      url.searchParams.get("checkoutMode") === "10";
  } catch { return false; }
}

export function getCheckoutBaseUrl(value = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL) {
  const candidate = value?.trim() || DEFAULT_HOTMART_CHECKOUT_URL;
  return isApprovedHotmartUrl(candidate, {
    pathname: "/Y106920957U",
    offer: "nzn1qn7n",
  }) ? new URL(candidate) : null;
}

export function getTeacherCheckoutBaseUrl(
  value = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL_IA_MAESTROS,
) {
  const candidate = value?.trim() || DEFAULT_IA_MAESTROS_CHECKOUT_URL;
  return isApprovedHotmartUrl(candidate, {
    pathname: "/M107670322C",
    offer: "f4a0vm6y",
  }) ? new URL(candidate) : null;
}

function addAttribution(checkout: URL, currentSearch: string) {
  const attribution = new URLSearchParams(currentSearch);
  for (const [key, value] of attribution) {
    if (ALLOWED_ATTRIBUTION.has(key) && value.trim() && !checkout.searchParams.has(key)) checkout.searchParams.set(key, value);
  }
  return checkout.toString();
}

export function buildCheckoutUrl(baseUrl = DEFAULT_HOTMART_CHECKOUT_URL, currentSearch = "") {
  const checkout = getCheckoutBaseUrl(baseUrl);
  if (!checkout) return null;
  return addAttribution(checkout, currentSearch);
}

export function buildTeacherCheckoutUrl(currentSearch = "") {
  const checkout = getTeacherCheckoutBaseUrl();
  return checkout ? addAttribution(checkout, currentSearch) : null;
}

export function formatPrice(price: { amount: number; currency: "MXN" }) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(price.amount);
}
