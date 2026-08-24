"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import type { LandingCampaign } from "@/lib/landings";
import { Brand } from "@/app/components/Brand";
import { ActiveCampaignForm } from "@/app/components/forms/ActiveCampaignForm";
import styles from "./page.module.css";

const audience = [
  "Quieres utilizar IA pero no sabes por dónde comenzar.",
  "No sabes qué pedirle para obtener una respuesta útil.",
  "Buscas ideas para actividades o clases.",
  "Quieres explicar algunos temas con más claridad.",
  "Quieres ahorrar tiempo sin perder tu criterio docente.",
  "Prefieres aprender con ejemplos sencillos y prácticos.",
];

const before = [
  "No sé qué preguntarle.",
  "No sé por dónde empezar.",
  "No sé cómo aplicarlo a mis clases.",
  "Todo esto parece demasiado técnico.",
];

const after = [
  "Ya entiendo para qué puede servirme.",
  "Ya sé qué tipo de apoyo pedirle.",
  "Ya encuentro aplicaciones para mi trabajo docente.",
  "Tengo una forma simple de comenzar.",
];

const prompts = [
  "Dame ideas para una actividad.",
  "Ayúdame a explicar este tema.",
  "Propón preguntas para repasar.",
  "Crea un ejemplo práctico y claro.",
  "Diseña una dinámica colaborativa.",
];

const learning = [
  "Qué puede hacer la IA por un maestro en situaciones reales.",
  "Cómo utilizarla para generar ideas de actividades.",
  "Cómo pedir apoyo para explicar temas con mayor claridad.",
  "Cómo generar preguntas para repasar.",
  "Cómo utilizarla como apoyo sin reemplazar tu experiencia ni criterio.",
];

const faqs = [
  { question: "¿La clase es gratuita?", answer: "Sí, la clase es gratuita." },
  {
    question: "¿Necesito experiencia con Inteligencia Artificial?",
    answer: "No. Está pensada para docentes que comienzan desde cero.",
  },
  { question: "¿Dónde será?", answer: "En línea." },
  {
    question: "¿Cómo recibiré el acceso?",
    answer:
      "Después de completar tu registro entrarás al grupo oficial de WhatsApp, donde se compartirán los avisos y el acceso.",
  },
];

function Icon({ name }: { name: "calendar" | "clock" | "screen" | "check" }) {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    screen: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8M12 18v4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function TeacherLandingPage({
  campaign,
  registrationError = false,
}: {
  campaign: LandingCampaign;
  registrationError?: boolean;
}) {
  useEffect(
    () =>
      trackMetaEventWhenReady("ViewContent", campaign.slug, {
        content_name: campaign.integrations.metaContentName,
        content_category: "Landing para docentes",
      }),
    [campaign.integrations.metaContentName, campaign.slug],
  );

  const goToForm = useCallback(() => {
    document.getElementById("registro-maestros")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className={styles.page}>
      {registrationError && (
        <p className={styles.globalError} role="alert">
          No pudimos confirmar el registro anterior. Completa el formulario nuevamente.
        </p>
      )}

      <header className={styles.header}>
        <div className={styles.shell}>
          <Brand />
          <div className={styles.headerActions}>
            <span>EDUCACIÓN + IA</span>
            <button type="button" onClick={goToForm}>Reservar lugar</button>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span />{campaign.eyebrow}</p>
            <h1>{campaign.headline}<strong>{campaign.highlightedHeadline}</strong></h1>
            <p className={styles.heroLead}>{campaign.intro}</p>
            <div className={styles.chips} aria-label="Características de la clase">
              <span><Icon name="check" />Sin experiencia previa</span>
              <span><Icon name="check" />Paso a paso</span>
              <span><Icon name="check" />Aplicado a la enseñanza</span>
            </div>
            <div className={styles.eventFacts}>
              <div><Icon name="calendar" /><span><small>FECHA</small><strong>2 de septiembre</strong></span></div>
              <div><Icon name="clock" /><span><small>HORA</small><strong>6:00 PM · Hora CDMX</strong></span></div>
              <div><Icon name="screen" /><span><small>MODALIDAD</small><strong>En línea · Gratuita</strong></span></div>
            </div>
            <button className={styles.primaryCta} type="button" onClick={goToForm}>{campaign.primaryCta}<span aria-hidden="true">→</span></button>
            <p className={styles.ctaNote}>{campaign.microcopy}</p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroHalo} />
            <div className={styles.heroTechGrid} />
            <div className={styles.boardLabel} aria-hidden="true">AULA + IA</div>
            <Image src={campaign.image.src} alt={campaign.image.alt} width={campaign.image.width} height={campaign.image.height} priority sizes="(max-width: 767px) 92vw, 45vw" />
            <div className={`${styles.floatCard} ${styles.floatOne}`}><span>✦</span>Ideas para actividades</div>
            <div className={`${styles.floatCard} ${styles.floatTwo}`}><span>✓</span>Explicaciones más claras</div>
            <div className={`${styles.floatCard} ${styles.floatThree}`}><span>?</span>Preguntas para repasar</div>
          </div>
        </div>
      </section>

      <section className={styles.audienceSection}>
        <div className={styles.shell}>
          <div className={styles.sectionIntro}><p>PARA QUIÉN ES</p><h2>Esta clase es para ti si eres maestro y...</h2></div>
          <div className={styles.audienceGrid}>{audience.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.transformationSection}>
        <div className={styles.shell}>
          <div className={styles.sectionIntro}><p>UNA RUTA CLARA</p><h2>De “no sé qué pedirle” a <span>“ya sé cómo empezar”</span></h2></div>
          <div className={styles.transformationGrid}>
            <article className={styles.beforeCard}><header><span>ANTES</span><strong>Confusión</strong></header><ul>{before.map((item) => <li key={item}>“{item}”</li>)}</ul></article>
            <div className={styles.transformArrow} aria-hidden="true">→</div>
            <article className={styles.afterCard}><header><span>DESPUÉS</span><strong>Claridad para comenzar</strong></header><ul>{after.map((item) => <li key={item}><Icon name="check" />“{item}”</li>)}</ul></article>
          </div>
        </div>
      </section>

      <section className={styles.techSection}>
        <div className={styles.techGlow} />
        <div className={`${styles.shell} ${styles.techGrid}`}>
          <div className={styles.techCopy}><p>INTELIGENCIA ARTIFICIAL + EDUCACIÓN</p><h2>Quizá ya conoces ChatGPT.<strong>Pero... ¿ya sabes cómo utilizar IA como maestro?</strong></h2><p className={styles.techClosing}>Eso también es aprender a usar IA.</p></div>
          <div className={styles.promptStack}>{prompts.map((prompt, index) => <article key={prompt}><span>{index % 2 === 0 ? "TÚ" : "IA"}</span><p>{prompt}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.learningSection} id="contenido-maestros">
        <div className={`${styles.shell} ${styles.learningGrid}`}>
          <div className={styles.learningIntro}><p>CLASE GRATUITA</p><h2>Qué aprenderás en esta clase gratuita</h2><aside><strong>No necesitas experiencia previa</strong><span>ni conocimientos técnicos.</span></aside></div>
          <ol>{learning.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol>
        </div>
      </section>

      <section className={styles.manifestoSection}>
        <div className={`${styles.shell} ${styles.manifestoGrid}`}>
          <div><p>UN PRINCIPIO EBIA</p><h2>LA IA PROPONE.<strong>EL MAESTRO DECIDE.</strong></h2><span className={styles.marker} /></div>
          <p>Utiliza la Inteligencia Artificial como apoyo para explorar ideas, organizar información y ahorrar tiempo, <strong>sin reemplazar tu experiencia ni tu criterio docente.</strong></p>
        </div>
      </section>

      <section className={styles.instructorSection}>
        <div className={`${styles.shell} ${styles.instructorGrid}`}>
          <div className={styles.instructorPhoto}><div /><Image src={campaign.image.src} alt={campaign.image.alt} width={campaign.image.width} height={campaign.image.height} sizes="(max-width: 767px) 88vw, 42vw" /></div>
          <div className={styles.instructorCopy}><p>TU GUÍA EN ESTA CLASE</p><h2>Aprende con una instructora real, paso a paso.</h2><p>Una clase creada para acompañar a docentes que quieren comenzar con ejemplos claros, sin tecnicismos innecesarios.</p>{campaign.instructor?.name ? <div className={styles.instructorMeta}><strong>{campaign.instructor.name}</strong>{campaign.instructor.role && <span>{campaign.instructor.role}</span>}{campaign.instructor.bio && <p>{campaign.instructor.bio}</p>}</div> : <small>Nombre, cargo y experiencia de la instructora: pendientes de confirmación por EBIA.</small>}</div>
        </div>
      </section>

      <section className={styles.midCta}><div className={styles.shell}><p>Tu primer paso puede ser sencillo.</p><h2>Empieza con claridad, no con confusión.</h2><button className={styles.primaryCta} type="button" onClick={goToForm}>RESERVAR MI LUGAR GRATIS <span aria-hidden="true">→</span></button></div></section>

      <section className={styles.registrationSection} id="registro-maestros">
        <div className={`${styles.shell} ${styles.registrationGrid}`}>
          <div className={styles.registrationCopy}><p>2 DE SEPTIEMBRE · 6:00 PM · EN LÍNEA</p><h2>Da el primer paso para usar IA con más claridad.</h2><ul><li><Icon name="check" />Clase gratuita</li><li><Icon name="check" />Desde cero</li><li><Icon name="check" />Enfocada en docentes</li></ul></div>
          <div className={styles.formCard}><span>PASO 1 DE 2</span><h2>Reserva tu lugar gratis</h2><p>Completa tus datos para registrarte. Después pasarás al último paso: entrar al grupo oficial de WhatsApp.</p><ActiveCampaignForm formId={campaign.integrations.activeCampaignFormId} campaign={campaign.slug} metaContentName={campaign.integrations.metaContentName} thankYouPath={`/landings/${campaign.slug}/gracias`} showIntro={false} /></div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}><div><p>PREGUNTAS FRECUENTES</p><h2>Lo esencial antes de registrarte.</h2></div><div>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div>
      </section>

      <section className={styles.finalCta}><div className={styles.shell}><p>La IA puede ayudarte.</p><h2>Tu criterio sigue siendo <span>lo más importante.</span></h2><p>Descubre cómo comenzar a utilizarla en tu trabajo docente, paso a paso y desde cero.</p><button className={styles.primaryCta} type="button" onClick={goToForm}>RESERVAR MI LUGAR GRATIS <span aria-hidden="true">→</span></button></div></section>

      <footer className={styles.footer}><div className={styles.shell}><Brand /><p>Escuela Básica de Inteligencia Artificial</p><small>© 2026 EBIA. Todos los derechos reservados.</small></div></footer>
    </main>
  );
}
