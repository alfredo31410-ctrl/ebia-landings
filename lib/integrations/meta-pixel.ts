export type MetaStandardEvent = "ViewContent" | "CompleteRegistration";
export type MetaCustomEvent = "RegistrationStart" | "WhatsAppGroupClick";
export type MetaEvent = MetaStandardEvent | MetaCustomEvent;
export type MetaEventParams = Record<string, string | number | boolean | undefined>;
export type DedupeScope = "persistent" | "session" | "none";

const STORAGE_PREFIX = "ebia:meta:v1";
const STANDARD_EVENTS = new Set<MetaEvent>(["ViewContent", "CompleteRegistration"]);

function storageFor(scope: DedupeScope): Storage | null {
  if (typeof window === "undefined" || scope === "none") return null;
  try { return scope === "persistent" ? window.localStorage : window.sessionStorage; }
  catch { return null; }
}

function eventKey(event: MetaEvent, campaign: string) { return `${STORAGE_PREFIX}:${campaign}:${event}`; }

function stableEventId(event: MetaEvent, campaign: string, storage: Storage | null) {
  const key = `${eventKey(event, campaign)}:event-id`;
  const saved = storage?.getItem(key);
  if (saved) return saved;
  const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try { storage?.setItem(key, id); } catch {}
  return id;
}

export function hasTrackedMetaEvent(event: MetaEvent, campaign: string, scope: DedupeScope = "persistent") {
  const storage = storageFor(scope);
  if (!storage) return false;
  try { return storage.getItem(eventKey(event, campaign)) === "1"; } catch { return false; }
}

export function resetTrackedMetaEvent(event: MetaEvent, campaign: string, scope: DedupeScope = "session") {
  const storage = storageFor(scope);
  if (!storage) return;
  try {
    storage.removeItem(eventKey(event, campaign));
    storage.removeItem(`${eventKey(event, campaign)}:event-id`);
  } catch {}
}

export function trackMetaEvent(event: MetaEvent, campaign: string, params: MetaEventParams = {}, scope: DedupeScope = "persistent") {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  const storage = storageFor(scope);
  if (storage && hasTrackedMetaEvent(event, campaign, scope)) return false;
  const eventId = stableEventId(event, campaign, storage);
  const payload = { content_name: campaign, ...params };
  if (STANDARD_EVENTS.has(event)) window.fbq("track", event, payload, { eventID: eventId });
  else window.fbq("trackCustom", event, payload, { eventID: eventId });
  try { storage?.setItem(eventKey(event, campaign), "1"); } catch {}
  window.dispatchEvent(new CustomEvent("ebia:conversion", { detail: { event, campaign, eventId, payload } }));
  return true;
}

export function trackMetaEventWhenReady(event: MetaEvent, campaign: string, params: MetaEventParams = {}, scope: DedupeScope = "persistent", maxAttempts = 20) {
  let attempts = 0;
  let timer: number | undefined;
  const run = () => {
    if (trackMetaEvent(event, campaign, params, scope) || hasTrackedMetaEvent(event, campaign, scope)) return;
    if (++attempts < maxAttempts) timer = window.setTimeout(run, 250);
  };
  run();
  return () => { if (timer) window.clearTimeout(timer); };
}

export function getMetaPixelBootstrap(pixelId: string) {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');`;
}

export const getMetaPixelNoscriptUrl = (pixelId: string) => `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`;
