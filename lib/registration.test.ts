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
  process.env.WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/invite-code";
  const { getWhatsAppGroupUrl } = await import("./whatsapp.ts");
  assert.equal(getWhatsAppGroupUrl(), "https://chat.whatsapp.com/invite-code");
  process.env.WHATSAPP_GROUP_URL = "https://example.com/open-redirect";
  assert.equal(getWhatsAppGroupUrl(), null);
  process.env.WHATSAPP_GROUP_URL = "http://chat.whatsapp.com/invite-code";
  assert.equal(getWhatsAppGroupUrl(), null);
  process.env.WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/invite-code?x=1";
  assert.equal(getWhatsAppGroupUrl(), null);
  process.env.WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/invite-code#fragment";
  assert.equal(getWhatsAppGroupUrl(), null);
});
