import assert from "node:assert/strict";
import test from "node:test";
import { getEventStatus, getCampaign } from "./landings.ts";

test("el estado del evento permanece abierto antes de la clase", () => {
  const campaign = getCampaign("ia-desde-cero");
  assert.equal(getEventStatus(campaign, new Date("2026-08-01T12:00:00-06:00")), "registration_open");
  assert.equal(getEventStatus(campaign, new Date("2026-08-12T14:00:00-06:00")), "live");
});

test("firma, expiración y sanitización de nonce/token", async () => {
  process.env.REGISTRATION_TOKEN_SECRET = "x".repeat(40);
  const { createRegistrationNonce, verifyRegistrationNonce, sanitizeAttribution } = await import("./registration.ts");
  const nonce = createRegistrationNonce("ia-desde-cero");
  assert.equal(verifyRegistrationNonce(nonce.value, "ia-desde-cero")?.nonce, nonce.data.nonce);
  assert.equal(verifyRegistrationNonce(`${nonce.value}x`, "ia-desde-cero"), null);
  assert.deepEqual(sanitizeAttribution({ utm_source: "meta", password: "no", utm_campaign: "x" }), { utm_source: "meta", utm_campaign: "x" });
});

test("el host de WhatsApp debe ser HTTPS y oficial", async () => {
  process.env.WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/invite-code";
  const { getWhatsAppGroupUrl } = await import("./whatsapp.ts");
  assert.equal(getWhatsAppGroupUrl(), "https://chat.whatsapp.com/invite-code");
  process.env.WHATSAPP_GROUP_URL = "https://example.com/open-redirect";
  assert.equal(getWhatsAppGroupUrl(), null);
});
