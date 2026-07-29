export function getWhatsAppGroupUrl() {
  const value = process.env.WHATSAPP_GROUP_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "chat.whatsapp.com" && url.pathname.length > 1 && !url.search && !url.hash ? url.toString() : null;
  } catch { return null; }
}
