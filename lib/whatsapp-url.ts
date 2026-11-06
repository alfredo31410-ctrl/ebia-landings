export function normalizeWhatsAppGroupUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" &&
      url.hostname === "chat.whatsapp.com" &&
      url.pathname.length > 1 &&
      !url.search &&
      !url.hash
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
