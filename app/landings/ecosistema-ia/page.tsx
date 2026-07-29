"use client";

import { useEffect, useRef, useState } from "react";
import { directSalesPage as content } from "@/content/directSalesPage";
import { buildCheckoutUrl, formatPrice, getValidCheckoutUrl } from "@/lib/checkout";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Page() {
  const [checkout, setCheckout] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState(0);
  const viewed = useRef(false);
  useEffect(() => {
    const base = getValidCheckoutUrl();
    const currentSearch = window.location.search || window.sessionStorage.getItem("ebia-attribution") || "";
    if (window.location.search) window.sessionStorage.setItem("ebia-attribution", window.location.search);
    setCheckout(base ? buildCheckoutUrl(base.toString(), currentSearch) : null);
    let attempts = 0;
    let timer: number | undefined;
    const trackView = () => {
      if (viewed.current) return;
      if (typeof window.fbq === "function") { window.fbq("track", "ViewContent", { content_name: content.product }); viewed.current = true; return; }
      if (++attempts < 20) timer = window.setTimeout(trackView, 250);
    };
    trackView();
    return () => { if (timer) window.clearTimeout(timer); };
  }, []);
  const buy = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!checkout) { event.preventDefault(); document.getElementById("checkout-status")?.focus(); return; }
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CheckoutButtonClick", { content_name: content.product, value: content.price.amount, currency: content.price.currency });
  };
  const href = checkout ?? "#checkout-status";
  return <main className="ecosystem-page">
    <div className="ecosystem-topline"><span className="status-dot" /> Ruta guiada para empezar con IA</div>
    <header className="ecosystem-header"><div className="ecosystem-shell"><a className="ecosystem-brand" href="#inicio" aria-label="EBIA, inicio">EBIA<span>.</span></a><a className="mini-cta" href={href} onClick={buy}>Quiero acceder a Ecosistema IA <Arrow /></a></div></header>

    <section className="ecosystem-hero" id="inicio"><div className="ecosystem-shell ecosystem-hero-grid"><div className="ecosystem-hero-copy"><p className="ecosystem-eyebrow">{content.eyebrow}</p><h1>{content.headline}<em>{content.accentHeadline}</em></h1><p className="ecosystem-lead">{content.subheadline}</p><div className="ecosystem-actions"><a className="ecosystem-primary" href={href} onClick={buy}>Quiero acceder a Ecosistema IA <Arrow /></a><a className="ecosystem-text-link" href="#incluye">Ver qué incluye <span>↓</span></a></div><p className="ecosystem-microcopy">{content.price.paymentLabel} · {formatPrice(content.price)} · Checkout seguro con Hotmart</p></div><div className="ecosystem-visual" aria-label="Vista previa del sistema de aprendizaje" role="img"><div className="visual-glow" /><div className="visual-grid" /><div className="visual-card visual-card--main"><small>tu ruta de aplicación</small><strong>Idea → instrucción → resultado</strong><div className="visual-progress"><i /><i /><i /></div><span>Aprende a repetir lo que funciona</span></div><div className="visual-card visual-card--float"><b>IA</b><span>criterio<br />+ práctica</span></div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /></div></div></section>

    <section className="ecosystem-trust"><div className="ecosystem-shell trust-grid"><div><small>PRODUCTO</small><strong>{content.category}</strong></div><div><small>NIVEL</small><strong>{content.level}</strong></div><div><small>MONEDA</small><strong>{content.price.currency}</strong></div><div><small>PROCESO</small><strong>Pago con Hotmart</strong></div></div></section>

    <section className="ecosystem-section problem-section"><div className="ecosystem-shell split-section"><div><p className="ecosystem-kicker">El punto de partida</p><h2>La IA no tiene que sentirse como otra cosa que aprender.</h2></div><div><p>{content.problem}</p><p className="muted">{content.audience}</p></div></div></section>

    <section className="ecosystem-section benefits-section-new"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">Lo que vas a construir</p><h2>Más claridad para pasar de probar a aplicar.</h2></div><div className="new-benefit-grid">{content.benefits.map((item, index) => <article key={item.title}><span className="benefit-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><strong>→ {item.outcome}</strong></article>)}</div></div></section>

    <section className="ecosystem-section method-section"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">El método</p><h2>Una secuencia corta que puedes volver a usar.</h2><p>{content.mechanism}</p></div><div className="method-flow"><article><small>ANTES</small><h3>Todo parece urgente</h3><p>Muchas herramientas, poca certeza sobre por dónde comenzar.</p></article><b>→</b><article className="method-center"><small>PROCESO</small><h3>Entender · pedir · revisar</h3><p>Una estructura para trabajar con intención y criterio.</p></article><b>→</b><article><small>DESPUÉS</small><h3>Un flujo a tu medida</h3><p>Una tarea concreta convertida en un sistema que puedes repetir.</p></article></div></div></section>

    <section className="ecosystem-section includes-section" id="incluye"><div className="ecosystem-shell include-grid"><div><p className="ecosystem-kicker">Dentro del ecosistema</p><h2>Todo lo necesario para practicar sin empezar de cero.</h2><a className="ecosystem-primary" href={href} onClick={buy}>Quiero acceder a Ecosistema IA <Arrow /></a></div><div className="include-list"><div><span>01</span><p><strong>Ruta de aprendizaje</strong><br />Cuatro módulos para pasar de conceptos a aplicación.</p></div><div><span>02</span><p><strong>Biblioteca de plantillas</strong><br />Puntos de partida para practicar con más estructura.</p></div><div><span>03</span><p><strong>Checklist de revisión</strong><br />Una guía para evaluar antes de usar un resultado.</p></div></div></div></section>

    <section className="ecosystem-section curriculum-section"><div className="ecosystem-shell curriculum-grid"><div className="section-intro"><p className="ecosystem-kicker">Ruta de aprendizaje</p><h2>Avanza por capas, no por saltos.</h2></div><div className="accordion">{content.modules.map((module, index) => <div className={`accordion-item ${openModule === index ? "is-open" : ""}`} key={module.number}><button aria-expanded={openModule === index} aria-controls={`module-${module.number}`} onClick={() => setOpenModule(openModule === index ? -1 : index)}><span>{module.number}</span><strong>{module.title}</strong><i>{openModule === index ? "−" : "+"}</i></button><div id={`module-${module.number}`} hidden={openModule !== index}><p>{module.result}</p><small>{module.topics.join(" · ")}</small></div></div>)}</div></div></section>

    <section className="ecosystem-section instructor-section"><div className="ecosystem-shell instructor-card"><div className="instructor-mark">EBIA<span>.</span></div><div><p className="ecosystem-kicker">Quién te acompaña</p><h2>{content.instructor}</h2><p>{content.instructorRole}. Una propuesta de formación centrada en explicar lo digital de forma práctica, ordenada y accionable.</p></div><div className="credential-stack"><span>Formación</span><span>Aplicación</span><span>Claridad</span></div></div></section>

    <section className="ecosystem-section offer-section"><div className="ecosystem-shell offer-grid"><div><p className="ecosystem-kicker">Tu acceso incluye</p><h2>Una base para trabajar con IA con más criterio.</h2><ul><li>Programa práctico de 4 módulos</li><li>Biblioteca de plantillas</li><li>Checklist de revisión</li></ul></div><aside className="price-card" id="checkout"><p className="ecosystem-kicker">{content.product}</p><div className="price">{formatPrice(content.price)}<small> {content.price.currency}</small></div><p>{content.price.paymentLabel}</p><a className="ecosystem-primary" href={href} onClick={buy}>Quiero acceder a Ecosistema IA <Arrow /></a><small className="secure-note">Procesamiento seguro con Hotmart.</small><p id="checkout-status" tabIndex={-1} className={!checkout ? "checkout-warning" : "checkout-warning is-hidden"}>No fue posible preparar el checkout. Inténtalo de nuevo más tarde.</p></aside></div></section>

    <section className="ecosystem-section after-section"><div className="ecosystem-shell"><div className="section-intro"><p className="ecosystem-kicker">Después de comprar</p><h2>El siguiente paso queda claro.</h2></div><div className="after-grid"><div><b>01</b><h3>Completa el pago</h3><p>Hotmart procesa la transacción de forma segura.</p></div><div><b>02</b><h3>Recibe la confirmación</h3><p>Consulta el correo con las instrucciones de acceso.</p></div><div><b>03</b><h3>Comienza la ruta</h3><p>Avanza a tu ritmo y aplica lo aprendido en una tarea real.</p></div></div></div></section>

    <section className="ecosystem-section faq-section"><div className="ecosystem-shell faq-grid"><div><p className="ecosystem-kicker">Preguntas frecuentes</p><h2>Antes de entrar, revisa lo esencial.</h2></div><div>{content.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

    <section className="ecosystem-final"><div className="ecosystem-shell"><p className="ecosystem-kicker">Empieza con una ruta</p><h2>Menos ruido. Más criterio para aplicar IA.</h2><p>{content.subheadline}</p><div className="final-price">{formatPrice(content.price)} <small>{content.price.currency} · {content.price.paymentLabel}</small></div><a className="ecosystem-primary" href={href} onClick={buy}>Quiero acceder a Ecosistema IA <Arrow /></a><small>Checkout seguro con Hotmart · Los resultados dependen de tu aplicación.</small></div></section>
    <footer className="ecosystem-footer"><div className="ecosystem-shell"><strong>EBIA<span>.</span></strong><p>Formación digital práctica.</p><small>© 2026 EBIA · Privacidad · Términos · Soporte</small></div></footer>
  </main>;
}
