import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTeacherCheckoutUrl,
  getTeacherCheckoutBaseUrl,
} from "./checkout.ts";

test("el checkout de IA para Maestros usa el producto y la oferta autorizados", () => {
  const checkout = getTeacherCheckoutBaseUrl();
  assert.ok(checkout);
  assert.equal(checkout.hostname, "pay.hotmart.com");
  assert.equal(checkout.pathname, "/M107670322C");
  assert.equal(checkout.searchParams.get("off"), "f4a0vm6y");
  assert.equal(checkout.searchParams.get("checkoutMode"), "10");
});

test("el checkout conserva atribución permitida y descarta parámetros arbitrarios", () => {
  const checkout = new URL(
    buildTeacherCheckoutUrl(
      "?utm_source=facebook&utm_campaign=maestros&fbclid=abc&redirect=https://example.com",
    )!,
  );
  assert.equal(checkout.searchParams.get("utm_source"), "facebook");
  assert.equal(checkout.searchParams.get("utm_campaign"), "maestros");
  assert.equal(checkout.searchParams.get("fbclid"), "abc");
  assert.equal(checkout.searchParams.has("redirect"), false);
});

test("el checkout rechaza dominios, productos u ofertas diferentes", () => {
  assert.equal(
    getTeacherCheckoutBaseUrl(
      "https://example.com/M107670322C?off=f4a0vm6y&checkoutMode=10",
    ),
    null,
  );
  assert.equal(
    getTeacherCheckoutBaseUrl(
      "https://pay.hotmart.com/M107670322C?off=otra&checkoutMode=10",
    ),
    null,
  );
});
