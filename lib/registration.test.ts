import assert from "node:assert/strict";
import test from "node:test";
import { getEventStatus, getCampaign } from "./landings.ts";

test("el estado del evento permanece abierto antes de la clase", () => {
  const campaign = getCampaign("ia-desde-cero");
  assert.equal(getEventStatus(campaign, new Date("2026-08-01T10:00:00-06:00")), "registration_open");
  assert.equal(getEventStatus(campaign, new Date("2026-08-12T14:00:00-06:00")), "live");
});

test("firma, expiración y sanitización de nonce/token", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { createRegistrationNonce, createRegistrationToken, verifyRegistrationNonce, verifyRegistrationToken, sanitizeAttribution } = await import("./registration.ts");
  const nonce = createRegistrationNonce("ia-desde-cero");
  assert.equal(verifyRegistrationNonce(nonce.value, "ia-desde-cero")?.nonce, nonce.data.nonce);
  assert.equal(verifyRegistrationNonce(`${nonce.value}x`, "ia-desde-cero"), null);
  assert.equal(verifyRegistrationNonce(nonce.value, "otra-landing"), null);
  const originalNow = Date.now;
  Date.now = () => originalNow() + 6 * 60 * 1000;
  assert.equal(verifyRegistrationNonce(nonce.value, "ia-desde-cero"), null);
  Date.now = originalNow;
  const token = createRegistrationToken("ia-desde-cero", {});
  Date.now = () => originalNow() + 25 * 60 * 60 * 1000;
  assert.equal(verifyRegistrationToken(token.value), null);
  Date.now = originalNow;
  assert.deepEqual(sanitizeAttribution({ utm_source: "meta", password: "no", utm_campaign: "x", utm_content: "a".repeat(201) }), { utm_source: "meta", utm_campaign: "x" });
  process.env.REGISTRATION_TOKEN_SECRET = "s".repeat(5);
  assert.throws(() => createRegistrationNonce("ia-desde-cero"));
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
});

test("el host de WhatsApp debe ser HTTPS y oficial", async () => {
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "https://chat.whatsapp.com/invite-code";
  const { getWhatsAppGroupUrl } = await import("./whatsapp.ts");
  assert.equal(getWhatsAppGroupUrl("ia-desde-cero"), "https://chat.whatsapp.com/invite-code");
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "https://example.com/open-redirect";
  assert.equal(getWhatsAppGroupUrl("ia-desde-cero"), null);
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "http://chat.whatsapp.com/invite-code";
  assert.equal(getWhatsAppGroupUrl("ia-desde-cero"), null);
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "https://chat.whatsapp.com/invite-code?x=1";
  assert.equal(getWhatsAppGroupUrl("ia-desde-cero"), null);
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "https://chat.whatsapp.com/invite-code#fragment";
  assert.equal(getWhatsAppGroupUrl("ia-desde-cero"), null);
});

test("registro-confirmado crea cookie y redirige a gracias con nonce valido", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { createRegistrationNonce } = await import("./registration.ts");
  const { GET } = await import("../app/landings/ia-desde-cero/registro-confirmado/route.ts");
  const nonce = createRegistrationNonce("ia-desde-cero");
  const response = await GET(new Request("https://example.test/landings/ia-desde-cero/registro-confirmado?utm_source=test", { headers: { cookie: `ebia_registration_nonce=${nonce.value}` } }));
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location") || "").pathname, "/landings/ia-desde-cero/gracias");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.match(response.headers.get("set-cookie") || "", /ebia_registration=/);
  assert.match(response.headers.get("set-cookie") || "", /Max-Age=86400/);
  assert.doesNotMatch(response.text ? await response.text() : "", /CompleteRegistration/);
});

test("registro-confirmado recupera nonce ausente, expirado, manipulado o de otra landing", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { createRegistrationNonce } = await import("./registration.ts");
  const { GET } = await import("../app/landings/ia-desde-cero/registro-confirmado/route.ts");
  const valid = createRegistrationNonce("ia-desde-cero");
  const otherLanding = createRegistrationNonce("otra-landing");
  const originalNow = Date.now;
  const expired = createRegistrationNonce("ia-desde-cero");
  Date.now = () => originalNow() + 6 * 60 * 1000;
  const cases = [
    undefined,
    `${valid.value}x`,
    otherLanding.value,
    expired.value,
  ];
  for (const value of cases) {
    const cookie = value ? { headers: { cookie: `ebia_registration_nonce=${value}` } } : undefined;
    const response = await GET(new Request("https://example.test/landings/ia-desde-cero/registro-confirmado", cookie));
    assert.equal(response.status, 303);
    assert.equal(new URL(response.headers.get("location") || "").search, "?registro=confirmacion_invalida");
    assert.doesNotMatch(response.headers.get("set-cookie") || "", /ebia_registration=/);
  }
  Date.now = originalNow;
});

test("los endpoints del navegador conservan el mismo origen visible", async () => {
  const originalWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { origin: "https://ebiacapacitacion.com" } } });
  const { getSameOriginUrl, IA_NONCE_PATH, IA_WHATSAPP_REDIRECT_PATH } = await import("./same-origin-url.ts");
  assert.equal(getSameOriginUrl(IA_NONCE_PATH), "https://ebiacapacitacion.com/landings/ia-desde-cero/api/registrations/nonce");
  assert.equal(getSameOriginUrl(IA_WHATSAPP_REDIRECT_PATH), "https://ebiacapacitacion.com/landings/ia-desde-cero/api/whatsapp/redirect");
  assert.throws(() => getSameOriginUrl("https://ebia-landings.vercel.app/landings/ia-desde-cero/api/registrations/nonce"), /cross_origin_endpoint/);
  assert.doesNotMatch(getSameOriginUrl(IA_NONCE_PATH), /ebia-landings\.vercel\.app|baseURI|VERCEL_URL/);
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (input, init) => {
      assert.equal(input, "https://ebiacapacitacion.com/landings/ia-desde-cero/api/registrations/nonce");
      assert.equal(init?.credentials, "same-origin");
      return new Response(JSON.stringify({ ok: true, nonce: "test-nonce", expiresAt: "2026-08-01T00:00:00.000Z" }), { status: 200, headers: { "content-type": "application/json" } });
    };
    const { requestRegistrationNonce } = await import("./registration-client.ts");
    await requestRegistrationNonce("ia-desde-cero");
  } finally {
    globalThis.fetch = originalFetch;
  }
  if (originalWindow === undefined) delete (globalThis as { window?: unknown }).window;
  else Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
});

test("la ruta prefijada de nonce conserva la validación y crea cookie segura", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { POST } = await import("../app/landings/ia-desde-cero/api/registrations/nonce/route.ts");
  const response = await POST(new Request("https://ebiacapacitacion.com/landings/ia-desde-cero/api/registrations/nonce", { method: "POST", headers: { origin: "https://ebiacapacitacion.com", "content-type": "application/json" }, body: JSON.stringify({ landing: "ia-desde-cero" }) }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.match(response.headers.get("set-cookie") || "", /ebia_registration_nonce=/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("access-control-allow-origin"), "https://ebiacapacitacion.com");
  assert.doesNotMatch(response.headers.get("access-control-allow-origin") || "", /,/);
  assert.equal(response.headers.get("vary"), "Origin");
});

test("el nonce acepta localhost y rechaza orígenes no incluidos en la allowlist", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { POST } = await import("../app/landings/ia-desde-cero/api/registrations/nonce/route.ts");
  for (const origin of ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"]) {
    const response = await POST(new Request(`${origin}/landings/ia-desde-cero/api/registrations/nonce`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify({ landing: "ia-desde-cero" }) }));
    assert.equal(response.status, 200, origin);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.doesNotMatch(response.headers.get("access-control-allow-origin") || "", /,/);
  }
  const rejected = await POST(new Request("https://ebiacapacitacion.com/landings/ia-desde-cero/api/registrations/nonce", { method: "POST", headers: { origin: "https://evil.example", "content-type": "application/json" }, body: JSON.stringify({ landing: "ia-desde-cero" }) }));
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.get("access-control-allow-origin"), null);
  assert.equal(rejected.headers.get("vary"), "Origin");
});

test("la ruta prefijada de WhatsApp solo redirige con token válido y destino server-side", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  process.env.WHATSAPP_GROUP_URL_IA_DESDE_CERO = "https://chat.whatsapp.com/invite-code";
  const { createRegistrationToken } = await import("./registration.ts");
  const { GET } = await import("../app/landings/ia-desde-cero/api/whatsapp/redirect/route.ts");
  const invalid = await GET(new Request("https://example.test/landings/ia-desde-cero/api/whatsapp/redirect?url=https://example.com"));
  assert.equal(invalid.status, 403);
  const token = createRegistrationToken("ia-desde-cero", {});
  const response = await GET(new Request("https://example.test/landings/ia-desde-cero/api/whatsapp/redirect?url=https://example.com", { headers: { cookie: `ebia_registration=${token.value}` } }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://chat.whatsapp.com/invite-code");
  assert.equal(response.headers.get("cache-control"), "no-store");
});
