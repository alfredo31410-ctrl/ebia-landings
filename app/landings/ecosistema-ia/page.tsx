"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { directSalesPage as content } from "@/content/directSalesPage";
import { buildCheckoutUrl, formatPrice, getCheckoutBaseUrl } from "@/lib/checkout";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Page() {
  const [checkout, setCheckout] = useState<string | null>(null);
  const viewed = useRef(false);
  useEffect(() => {
    document.title = "Reto Práctico de Inteligencia Artificial de 3 Días | EBIA";
    const stored = window.sessionStorage.getItem("ebia-attribution") || "";
    const search = window.location.search || stored;
    if (window.location.search) window.sessionStorage.setItem("ebia-attribution", window.location.search);
    const base = getCheckoutBaseUrl();
    setCheckout(base ? buildCheckoutUrl(base.toString(), search) : null);
    let attempts = 0; let timer: number | undefined;
    const trackView = () => {
      if (viewed.current) return;
      if (typeof window.fbq === "function") { window.fbq("track", "ViewContent", { content_name: content.product.name, value: content.price.amount, currency: content.price.currency }); viewed.current = true; }
      else if (++attempts < 20) timer = window.setTimeout(trackView, 250);
    };
    trackView();
    return () => { if (timer) window.clearTimeout(timer); };
  }, []);
  const buy = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!checkout) { event.preventDefault(); document.getElementById("checkout-status")?.focus(); return; }
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CheckoutButtonClick", { content_name: content.product.name, value: content.price.amount, currency: content.price.currency });
  };
  const href = checkout ?? "#checkout-status";
  const cta = "Quiero entrar al reto de IA";
  return <main className="ecosystem-page challenge-page">
    <div className="ecosystem-topline"><span className="status-dot" /> {content.eyebrow}</div>
    <header className="ecosystem-header"><div className="ecosystem-shell"><a className="ecosystem-brand" href="#inicio" aria-label="EBIA, inicio">EBIA<span>.</span></a><a className="mini-cta" href={href} onClick={buy}>{cta} <Arrow /></a></div></header>
    <section className="ecosystem-hero sales-hero" id="inicio"><div className="ecosystem-shell ecosystem-hero-grid"><div className="ecosystem-hero-copy sales-hero__content"><p className="ecosystem-eyebrow">{content.eyebrow}</p><h1>{content.product.name}</h1><p className="ecosystem-lead">{content.promise}</p><div className="ecosystem-actions"><a className="ecosystem-primary" href={href} onClick={buy}>{cta} <Arrow /></a><a className="ecosystem-text-link" href="#incluye">Ver qué incluye <span>↓</span></a></div><p className="ecosystem-microcopy">{content.price.paymentLabel} · {content.price.formatted} · Pago seguro procesado por Hotmart.</p><p className="seller-note">La compra es procesada para {content.seller}.</p></div><div className="ecosystem-visual sales-hero__visual" aria-label="Fotografía de la instructora del reto práctico de inteligencia artificial" role="img"><div className="visual-glow" /><div className="visual-grid" /><Image className="hero-instructor" src="/landings/media/images/landings/reto-ia/instructora-hero.png" alt="Instructora del reto práctico de inteligencia artificial" width={1067} height={1600} priority sizes="(max-width: 620px) 92vw, (max-width: 1024px) 48vw, 470px" /></div></div></section>
    <section className="ecosystem-trust"><div className="ecosystem-shell trust-grid"><div><small>FECHAS</small><strong>{content.product.dates}</strong></div><div><small>MODALIDAD</small><strong>{content.product.format}</strong></div><div><small>NIVEL</small><strong>{content.product.level}</strong></div><div><small>PROCESO</small><strong>Pago con Hotmart</strong></div></div></section>
    <section className="ecosystem-section problem-section"><div className="ecosystem-shell split-section"><div><p className="ecosystem-kicker">Para quién es</p><h2>Una primera experiencia práctica con inteligencia artificial.</h2></div><ul className="audience-list">{content.audience.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    <section className="ecosystem-section benefits-section-new"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">Qué podrás comenzar a hacer</p><h2>Aprende lo esencial para pasar a la práctica.</h2></div><div className="new-benefit-grid">{content.outcomes.map((item, index) => <article key={item.title}><span className="benefit-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
    <section className="ecosystem-section method-section"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">Cómo funciona el reto</p><h2>Tres días para empezar con una guía clara.</h2></div><div className="method-flow method-flow--short">{content.howItWorks.map((item, index) => <article key={item}><small>0{index + 1}</small><p>{item}</p></article>)}</div></div></section>
    <section className="ecosystem-section includes-section" id="incluye"><div className="ecosystem-shell include-grid"><div><p className="ecosystem-kicker">Qué incluye</p><h2>Una experiencia breve, en vivo y enfocada en aplicar.</h2><a className="ecosystem-primary" href={href} onClick={buy}>{cta} <Arrow /></a></div><ul className="include-list include-list--clean">{content.includes.map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></div></section>
    <section className="ecosystem-section offer-section"><div className="ecosystem-shell offer-grid"><div><p className="ecosystem-kicker">Tu acceso</p><h2>Inteligencia artificial aplicada desde cero.</h2><p className="offer-description">Acceso al Reto Práctico de Inteligencia Artificial de 3 Días.</p></div><aside className="price-card" id="checkout"><p className="ecosystem-kicker">{content.product.shortName}</p><div className="price">{content.price.formatted}</div><p>{content.price.paymentLabel}</p><a className="ecosystem-primary" href={href} onClick={buy}>{cta} <Arrow /></a><small className="secure-note">Checkout seguro con Hotmart.<br />La compra es procesada para {content.seller}.</small><p id="checkout-status" tabIndex={-1} className={!checkout ? "checkout-warning" : "checkout-warning is-hidden"}>No fue posible preparar el checkout. Inténtalo de nuevo más tarde.</p></aside></div></section>
    <section className="ecosystem-section after-section"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">Después de pagar</p><h2>El siguiente paso queda claro.</h2></div><div className="after-grid after-grid--three">{content.afterPurchase.map((item, index) => <div key={item}><b>0{index + 1}</b><p>{item}</p></div>)}</div></div></section>
    <section className="ecosystem-section faq-section"><div className="ecosystem-shell faq-grid"><div><p className="ecosystem-kicker">Preguntas frecuentes</p><h2>Antes de entrar, revisa lo esencial.</h2></div><div>{content.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>
    <section className="ecosystem-final"><div className="ecosystem-shell"><p className="ecosystem-kicker">{content.product.dates} · {content.product.format}</p><h2>Empieza a utilizar la inteligencia artificial con una guía práctica.</h2><p>Participa en tres días en vivo diseñados para ayudarte a comenzar desde cero, ahorrar tiempo, crear contenido y mejorar tu productividad.</p><div className="final-price">{formatPrice(content.price)} <small>{content.price.paymentLabel}</small></div><a className="ecosystem-primary" href={href} onClick={buy}>{cta} <Arrow /></a><small>Pago seguro procesado por Hotmart.</small></div></section>
    <footer className="ecosystem-footer"><div className="ecosystem-shell"><strong>EBIA<span>.</span></strong><p>Formación digital práctica.</p><small>© 2026 EBIA · Privacidad · Términos · Soporte</small></div></footer>
  </main>;
}
