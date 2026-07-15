"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { LandingCampaign } from "@/lib/landings";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import { Brand } from "./Brand";
import { ActiveCampaignForm } from "./forms/ActiveCampaignForm";

const icons = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  screen: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  brain: <><path d="M9.5 4a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5 13a3 3 0 0 0 4.5 3M14.5 4a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 19 13a3 3 0 0 1-4.5 3M9.5 4v16M14.5 4v16M7 9h2.5M14.5 9H17M7 15h2.5M14.5 15H17"/></>,
  message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.6-4A7 7 0 0 1 3 13V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></>,
  rocket: <><path d="M14 5c3-3 6-3 6-3s0 3-3 6l-5 5-4-4Z"/><path d="m9 12-4 1-3 3 6 1 1 5 3-3 1-4M15 7h.01"/></>,
};

function Icon({ name }: { name: keyof typeof icons }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>; }

export function LandingPage({ campaign }: { campaign: LandingCampaign }) {
  useEffect(() => trackMetaEventWhenReady("ViewContent", campaign.slug, { content_name: campaign.integrations.metaContentName, content_category: "Landing" }), [campaign.integrations.metaContentName, campaign.slug]);
  const goToForm = useCallback(() => { trackMetaEventWhenReady("RegistrationStart", campaign.slug, { content_name: campaign.integrations.metaContentName, content_category: "Formulario ActiveCampaign" }, "session"); document.querySelector("#registro")?.scrollIntoView({ behavior: "smooth" }); }, [campaign.integrations.metaContentName, campaign.slug]);

  return <main className="campaign">
    <div className="live-bar"><span />Clase en vivo para principiantes</div>
    <header className="landing-header shell"><Brand /><button className="header-cta" type="button" onClick={goToForm}>Reservar acceso</button></header>

    <section className="hero-section"><div className="shell hero-layout">
      <div className="hero-copy"><p className="eyebrow">✦ {campaign.eyebrow}</p><h1>{campaign.headline}<span>{campaign.highlightedHeadline}</span></h1><p className="lead">{campaign.intro}</p><div className="actions"><button className="cta-primary" type="button" onClick={goToForm}>{campaign.primaryCta}<span>→</span></button><a className="cta-secondary" href="#contenido"><span>▶</span>{campaign.secondaryCta}</a></div><p className="microcopy">♢ {campaign.microcopy}</p></div>
      <div className="hero-visual"><div className="hero-blob"/><div className="hero-grid"/><Image className="instructor" src="/ia-desde-cero/Foto1.png" alt={campaign.image.alt} width={1067} height={1600} priority sizes="(max-width: 800px) 100vw, 52vw"/><div className="process-cards"><article><b>✦</b><span>Idea<strong>desordenada</strong></span></article><i>↓</i><article><b>⌁</b><span>Prompt<strong>mejorado</strong></span></article><i>↓</i><article><b>✓</b><span>Resultado<strong>útil</strong></span></article></div><div className="visual-badges"><span>◉ Nivel inicial</span><span>ϟ Ejercicios prácticos</span></div></div>
    </div><div className="shell facts-band">{campaign.facts.map((fact, index) => <article key={fact.label}><span className="fact-icon"><Icon name={(["calendar","clock","pin","screen"] as const)[index]} /></span><div><small>{fact.label}</small><strong>{fact.value}</strong></div></article>)}</div></section>

    <section className="benefits-section" id="contenido"><div className="shell"><div className="section-title"><p>✦ {campaign.section.eyebrow}</p><h2>Una base <span>útil</span> para empezar a trabajar con IA</h2></div><div className="benefit-grid">{campaign.section.outcomes.map((item, index) => <article key={item.title}><span className="benefit-icon"><Icon name={(["brain","message","rocket"] as const)[index]} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
      <div className="prompt-demo"><h2>De una idea confusa a una <span>instrucción útil</span></h2><div className="prompt-flow"><article><small>Antes</small><h3>Idea desordenada</h3><p>Necesito un texto para promocionar mi curso.</p><span>Demasiado general, sin contexto ni detalles importantes.</span></article><b>→</b><article className="prompt-editor"><small>Mejoramos tu prompt</small><p>Actúa como copywriter. Escribe un texto breve y persuasivo para promocionar una clase en vivo de IA para principiantes.</p><div>Rol ✓ · Objetivo ✓ · Contexto ✓ · CTA ✓</div></article><b>→</b><article className="prompt-result"><small>Después</small><h3>Resultado útil</h3><p>Únete a nuestra clase en vivo de IA para principiantes. Aprende a crear mejores instrucciones y aplicar herramientas desde el primer día.</p><span>✓</span></article></div></div>
    </div></section>

    <section className="registration-section" id="registro"><div className="shell registration-layout"><div className="registration-copy"><Brand inverse/><h2>Reserva tu<br/>acceso gratuito</h2><p>Una clase práctica para empezar con claridad y aplicar IA desde el primer día.</p><div className="registration-facts">{campaign.facts.map((fact, index) => <article key={fact.label}><Icon name={(["calendar","clock","pin","screen"] as const)[index]} /><strong>{fact.value}</strong></article>)}</div><p className="social-proof"><span>★★★★★</span> Únete a personas que están aprendiendo con EBIA.</p></div><div className="form-card"><ActiveCampaignForm formId={campaign.integrations.activeCampaignFormId} campaign={campaign.slug} metaContentName={campaign.integrations.metaContentName} thankYouPath={`/landings/${campaign.slug}/gracias`} /></div></div></section>
    <footer className="landing-footer"><div className="shell"><Brand /><p>Hacemos que la inteligencia artificial sea clara, útil y accesible para todos.</p><small>© 2026 EBIA. Todos los derechos reservados.</small></div></footer>
  </main>;
}
