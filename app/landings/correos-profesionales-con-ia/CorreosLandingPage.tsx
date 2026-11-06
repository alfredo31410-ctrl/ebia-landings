"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "@/app/components/Brand";
import { ActiveCampaignForm } from "@/app/components/forms/ActiveCampaignForm";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import type { LandingCampaign } from "@/lib/landings";
import styles from "./page.module.css";

const outcomes = [
  {
    number: "01",
    title: "Da instrucciones claras a la IA",
    copy: "Incluye objetivo, destinatario y contexto para recibir una propuesta útil desde el primer intento.",
  },
  {
    number: "02",
    title: "Convierte notas en un correo",
    copy: "Pasa de ideas sueltas a un mensaje ordenado, profesional y fácil de leer.",
  },
  {
    number: "03",
    title: "Adapta el tono y el cierre",
    copy: "Ajusta la forma de comunicarte y deja claro el siguiente paso sin sonar frío ni ambiguo.",
  },
] as const;

const steps = [
  { label: "CONTEXTO", title: "Explica la situación", copy: "Quién recibirá el mensaje, qué ocurrió y qué necesitas comunicar." },
  { label: "INTENCIÓN", title: "Define el objetivo", copy: "Informar, solicitar, confirmar, dar seguimiento o resolver un asunto." },
  { label: "TONO", title: "Marca cómo debe sonar", copy: "Profesional, cordial, directo o empático según cada conversación." },
  { label: "ACCIÓN", title: "Aclara el siguiente paso", copy: "Indica qué esperas, de quién y para cuándo, sin dejar cabos sueltos." },
] as const;

const faqs = [
  { question: "¿La clase es gratuita?", answer: "Sí. La clase será en línea y el registro no tiene costo." },
  { question: "¿Necesito experiencia usando Inteligencia Artificial?", answer: "No. Partiremos de instrucciones sencillas y ejemplos de correos cotidianos de trabajo." },
  { question: "¿La IA enviará los correos por mí?", answer: "No. Aprenderás a utilizarla para preparar y mejorar borradores. Tú revisas, decides y envías cada mensaje." },
  { question: "¿Cómo recibiré el acceso?", answer: "Después de registrarte entrarás al grupo oficial de WhatsApp, donde compartiremos el enlace y los recordatorios." },
] as const;

function Icon({ name }: { name: "calendar" | "clock" | "screen" | "check" | "arrow" }) {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    screen: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8M12 18v4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function MailIllustration() {
  return (
    <div className={styles.mailScene} aria-label="Ilustración de un correo profesional aprobado">
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.browser}>
        <div className={styles.browserBar}><i /><i /><i /></div>
        <div className={styles.browserBody}>
          <span className={styles.subjectLine} />
          <div className={styles.envelope}><span /><i /></div>
          <span className={styles.copyLine} />
          <span className={styles.copyLineShort} />
        </div>
        <div className={styles.approval}><Icon name="check" /></div>
      </div>
      <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true">✦</span>
      <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true">✦</span>
    </div>
  );
}

export function CorreosLandingPage({
  campaign,
  registrationError = false,
}: {
  campaign: LandingCampaign;
  registrationError?: boolean;
}) {
  const formCardRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(
    () =>
      trackMetaEventWhenReady("ViewContent", campaign.slug, {
        content_name: campaign.integrations.metaContentName,
        content_category: "Clase gratuita de comunicación profesional",
      }),
    [campaign.integrations.metaContentName, campaign.slug],
  );

  useEffect(() => {
    const formCard = formCardRef.current;
    if (!formCard || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFormVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(formCard);
    return () => observer.disconnect();
  }, []);

  const goToForm = useCallback(() => {
    trackMetaEventWhenReady(
      "RegistrationStart",
      campaign.slug,
      {
        content_name: campaign.integrations.metaContentName,
        content_category: "Formulario ActiveCampaign",
      },
      "session",
    );
    document.getElementById("formulario-correos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [campaign.integrations.metaContentName, campaign.slug]);

  return (
    <main className={styles.page}>
      {registrationError && (
        <p className={styles.globalError} role="alert">
          No pudimos confirmar el registro anterior. Completa el formulario nuevamente.
        </p>
      )}

      <div className={styles.announcement}>CLASE GRATUITA · MARTES 10 DE NOVIEMBRE · 1:00 P. M. CDMX</div>

      <header className={styles.header}>
        <div className={styles.shell}>
          <Brand />
          <nav aria-label="Navegación principal">
            <a href="#aprenderas">Lo que aprenderás</a>
            <a href="#metodo">El método</a>
            <a href="#instructora">Instructora</a>
          </nav>
          <button type="button" onClick={goToForm} aria-controls="formulario-correos">RESERVAR LUGAR</button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span />CLASE GRATUITA · EBIA</p>
            <h1>Correos profesionales <span>con IA</span></h1>
            <p className={styles.heroLead}>Escribe con claridad, transmite profesionalismo y ayuda a resolver asuntos del trabajo.</p>
            <ul className={styles.heroBenefits}>
              <li><Icon name="check" />Da instrucciones claras a la IA.</li>
              <li><Icon name="check" />Convierte notas sueltas en un correo profesional.</li>
              <li><Icon name="check" />Adapta el tono y deja claro el siguiente paso.</li>
            </ul>
            <div className={styles.heroActions}>
              <button className={styles.primaryCta} type="button" onClick={goToForm} aria-controls="formulario-correos">RESERVAR MI LUGAR GRATIS <Icon name="arrow" /></button>
              <p>En línea · Sin costo · Desde cero</p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.eventPill}><strong>Martes 10 de noviembre</strong><span>1:00 p. m. · hora CDMX</span></div>
            <MailIllustration />
          </div>
        </div>

        <div className={`${styles.shell} ${styles.facts}`}>
          <article><Icon name="calendar" /><span><small>FECHA</small><strong>Martes 10 de noviembre</strong></span></article>
          <article><Icon name="clock" /><span><small>HORA</small><strong>1:00 p. m. · CDMX</strong></span></article>
          <article><Icon name="screen" /><span><small>MODALIDAD</small><strong>En línea · Gratuita</strong></span></article>
        </div>
      </section>

      <section className={styles.outcomesSection} id="aprenderas">
        <div className={styles.shell}>
          <div className={styles.sectionHeading}><p>LO QUE TE LLEVARÁS</p><h2>De una idea suelta a un mensaje que <span>sí mueve el trabajo.</span></h2></div>
          <div className={styles.outcomesGrid}>
            {outcomes.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className={styles.demoSection}>
        <div className={`${styles.shell} ${styles.demoGrid}`}>
          <div className={styles.demoCopy}>
            <p>UN EJEMPLO REALISTA</p>
            <h2>No necesitas empezar con el correo perfecto.</h2>
            <p>Entrega a la IA las piezas importantes. Después revisa su propuesta y decide qué conservar.</p>
            <div className={styles.principle}><strong>La IA propone.</strong><span>Tú revisas, ajustas y envías.</span></div>
          </div>
          <div className={styles.emailFlow}>
            <article className={styles.notesCard}><small>TUS NOTAS</small><p>“Proyecto retrasado. Necesito el reporte hoy. Preguntar si necesitan apoyo.”</p></article>
            <span className={styles.flowArrow} aria-hidden="true">↓</span>
            <article className={styles.emailCard}><header><span>Para: Equipo de proyecto</span><b>LISTO PARA REVISAR</b></header><h3>Seguimiento del reporte pendiente</h3><p>Hola, equipo:</p><p>Para mantener el calendario del proyecto, necesitamos recibir el reporte pendiente hoy. Si existe algún bloqueo, por favor compártanlo para definir cómo podemos apoyarlos.</p><p>¿Podrían confirmar el horario estimado de entrega?</p><p>Gracias.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.methodSection} id="metodo">
        <div className={styles.shell}>
          <div className={styles.sectionHeading}><p>UN MÉTODO EN CUATRO PARTES</p><h2>Qué decirle a la IA para recibir un mejor borrador.</h2></div>
          <div className={styles.stepsGrid}>{steps.map((step, index) => <article key={step.label}><span>0{index + 1}</span><small>{step.label}</small><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.instructorSection} id="instructora">
        <div className={`${styles.shell} ${styles.instructorGrid}`}>
          <div className={styles.instructorPhoto}><div /><Image src={campaign.image.src} alt={campaign.image.alt} width={campaign.image.width} height={campaign.image.height} sizes="(max-width: 760px) 92vw, 42vw" /></div>
          <div className={styles.instructorCopy}><p>TU GUÍA EN ESTA CLASE</p><h2>Aprende con ejemplos claros y aplicables.</h2><p>Miranda te acompañará paso a paso para convertir situaciones cotidianas de trabajo en instrucciones que la IA pueda entender y transformar en mejores borradores.</p><div><strong>{campaign.instructor?.name}</strong><span>{campaign.instructor?.role}</span></div><button className={styles.primaryCta} type="button" onClick={goToForm} aria-controls="formulario-correos">QUIERO REGISTRARME <Icon name="arrow" /></button></div>
        </div>
      </section>

      <section className={styles.registrationSection} id="registro-correos">
        <div className={`${styles.shell} ${styles.registrationGrid}`}>
          <div className={styles.registrationCopy}><p>MARTES 10 DE NOVIEMBRE · 1:00 P. M. CDMX</p><h2>Escribe tu próximo correo con más claridad.</h2><ul><li><Icon name="check" />Clase gratuita y en línea</li><li><Icon name="check" />No necesitas experiencia previa</li><li><Icon name="check" />Ejemplos aplicados al trabajo</li></ul></div>
          <div className={styles.formCard} id="formulario-correos" ref={formCardRef}>
            <span>PASO 1 DE 2</span><h2>Reserva tu lugar gratis</h2><p>Completa tus datos. Después entrarás al grupo oficial de WhatsApp para recibir el acceso.</p>
            {campaign.integrations.activeCampaignFormId ? (
              <ActiveCampaignForm formId={campaign.integrations.activeCampaignFormId} campaign={campaign.slug} metaContentName={campaign.integrations.metaContentName} confirmationPath={`/landings/${campaign.slug}/registro-confirmado`} showIntro={false} />
            ) : (
              <div className={styles.formPending} role="status"><strong>El registro abrirá muy pronto.</strong><span>Vuelve en breve para reservar tu lugar.</span></div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div><p>PREGUNTAS FRECUENTES</p><h2>Lo esencial antes de registrarte.</h2></div>
          <div>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <footer className={styles.footer}><div className={styles.shell}><Brand inverse /><p>Inteligencia artificial clara, útil y aplicable.</p><small>© 2026 EBIA. Todos los derechos reservados.</small></div></footer>
      {!isFormVisible && (
        <button className={styles.mobileCta} type="button" onClick={goToForm} aria-controls="formulario-correos">RESERVAR MI LUGAR GRATIS <Icon name="arrow" /></button>
      )}
    </main>
  );
}
