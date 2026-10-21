"use client";

import Image from "next/image";
import Script from "next/script";
import { useCallback, useEffect } from "react";
import { Brand } from "@/app/components/Brand";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import styles from "./page.module.css";

const SLUG = "tareas-con-ia";

const situations = [
  {
    icon: "?",
    title: "No recuerdas el tema",
    copy: "Quieres ayudar, pero el método cambió o ya no recuerdas bien los conceptos.",
    color: "coral",
  },
  {
    icon: "↗",
    title: "No sabes cómo explicarlo",
    copy: "Entiendes la respuesta, pero encontrar palabras sencillas se vuelve complicado.",
    color: "blue",
  },
  {
    icon: "⌁",
    title: "Terminan frustrados",
    copy: "La tarea se alarga y lo que debía ser aprendizaje termina en tensión para ambos.",
    color: "yellow",
  },
] as const;

const steps = [
  { number: "1", eyebrow: "PRIMERO", title: "Pregunta", copy: "Dale a la IA el contexto: edad, materia, tema y qué parte está causando dificultad." },
  { number: "2", eyebrow: "DESPUÉS", title: "Adapta", copy: "Pide una explicación sencilla, un ejemplo cotidiano o un ejercicio del mismo nivel." },
  { number: "3", eyebrow: "AL FINAL", title: "Acompaña", copy: "Deja que tu hijo piense, responda y practique. Tú decides cómo utilizar cada propuesta." },
] as const;

const faqs = [
  { question: "¿La clase será gratuita?", answer: "Sí. Será una clase en línea y el registro no tendrá costo." },
  { question: "¿Necesito saber usar Inteligencia Artificial?", answer: "No. La clase comenzará desde cero y utilizará ejemplos sencillos para madres y padres." },
  { question: "¿La IA hará la tarea por mis hijos?", answer: "No es el objetivo. Aprenderás a utilizarla para explicar, practicar y revisar, manteniendo al estudiante como protagonista." },
  { question: "¿Para qué edades puede servir?", answer: "Los principios se pueden adaptar a distintas edades. En la clase veremos cómo ajustar el lenguaje y la dificultad al nivel de cada estudiante." },
] as const;

function Spark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 3v17M32 44v17M3 32h17M44 32h17M11 11l12 12M41 41l12 12M53 11 41 23M23 41 11 53" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function EventReminder() {
  return (
    <div
      className={styles.eventReminder}
      aria-label="Clase gratuita: 29 de octubre de 2026 a las 12 del mediodía, hora de Ciudad de México"
    >
      <span aria-hidden="true" />
      <strong>29 DE OCTUBRE</strong>
      <i aria-hidden="true">·</i>
      <strong>12:00 P. M.</strong>
      <i aria-hidden="true">·</i>
      <b>CDMX</b>
    </div>
  );
}

export function TareasLandingPage() {
  useEffect(
    () =>
      trackMetaEventWhenReady("ViewContent", SLUG, {
        content_name: "Haz la tarea de tus hijos con IA",
        content_category: "Clase gratuita para madres y padres",
      }),
    [],
  );

  const goToRegistration = useCallback(() => {
    trackMetaEventWhenReady(
      "RegistrationStart",
      SLUG,
      {
        content_name: "Haz la tarea de tus hijos con IA",
        content_category: "Formulario ActiveCampaign",
      },
      "session",
    );
    document.getElementById("registro-tareas")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.announcement}>
        <span aria-hidden="true" />
        CLASE GRATUITA · 29 DE OCTUBRE · 12:00 P. M. CDMX
        <span aria-hidden="true" />
      </div>

      <header className={styles.header}>
        <div className={styles.shell}>
          <Brand />
          <nav aria-label="Navegación principal">
            <a href="#aprenderas">Lo que aprenderás</a>
            <a href="#metodo">El método</a>
            <a href="#instructora">Instructora</a>
          </nav>
          <button type="button" onClick={goToRegistration}>REGISTRARME GRATIS</button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroDoodles} aria-hidden="true">
          <span className={styles.doodleBook}>▱</span>
          <span className={styles.doodleMath}>+ ÷</span>
          <span className={styles.doodlePencil}>✎</span>
          <span className={styles.doodleStar}>✦</span>
          <Spark className={styles.sparkOne} />
          <Spark className={styles.sparkTwo} />
        </div>
        <div className={`${styles.shell} ${styles.heroInner}`}>
          <p className={styles.handwritten}>ANTES DE LA PRÓXIMA TAREA</p>
          <h1>
            Haz la tarea de tus hijos
            <span>con ayuda de la IA</span>
          </h1>
          <p className={styles.heroLead}>
            Deja de pasar horas buscando cómo explicarlo. Aprende a utilizar
            Inteligencia Artificial para entender el tema y acompañarlos paso a paso,
            <strong> sin resolver todo por ellos.</strong>
          </p>
          <button className={styles.primaryCta} type="button" onClick={goToRegistration}>
            REGISTRARME GRATIS <span aria-hidden="true">→</span>
          </button>
          <EventReminder />
          <p className={styles.microcopy}>Clase en línea · Sin costo · Empieza desde cero</p>
        </div>
      </section>

      <section className={styles.familySection} aria-label="Familia aprendiendo en casa">
        <div className={`${styles.shell} ${styles.familyFrame}`}>
          <Image
            src="/landings/tareas-con-ia/hero-familia-tareas.webp"
            alt="Madre y padre acompañando a su hija mientras realiza su tarea con apoyo de una computadora"
            width={1774}
            height={887}
            priority
            sizes="(max-width: 760px) 94vw, 1180px"
          />
          <div className={`${styles.note} ${styles.noteOne}`}><b>01</b><span>Explícalo<br />más fácil</span></div>
          <div className={`${styles.note} ${styles.noteTwo}`}><b>02</b><span>Crea un<br />ejemplo</span></div>
          <div className={`${styles.note} ${styles.noteThree}`}><b>03</b><span>Practiquen<br />juntos</span></div>
        </div>
      </section>

      <section className={styles.situationsSection}>
        <div className={styles.shell}>
          <div className={`${styles.centerHeading} ${styles.reveal}`}>
            <p className={styles.handwritten}>LA PRÓXIMA TAREA NO TIENE QUE TERMINAR IGUAL</p>
            <h2>¿También te ha pasado?</h2>
          </div>
          <div className={`${styles.situationGrid} ${styles.staggerGrid}`}>
            {situations.map((item) => (
              <article key={item.title} className={styles[item.color]}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className={`${styles.ctaRow} ${styles.reveal}`}>
            <button className={styles.primaryCta} type="button" onClick={goToRegistration}>
              REGISTRARME GRATIS <span aria-hidden="true">→</span>
            </button>
            <EventReminder />
          </div>
        </div>
      </section>

      <section className={styles.explainSection} id="aprenderas">
        <div className={`${styles.shell} ${styles.splitGrid} ${styles.reveal}`}>
          <div className={styles.demoCanvas} aria-label="Ejemplo de una explicación adaptada">
            <div className={styles.demoQuestion}>
              <small>TÚ PREGUNTAS</small>
              <p>Explícale las fracciones a una niña de 9 años con un ejemplo cotidiano.</p>
            </div>
            <span className={styles.demoArrow} aria-hidden="true">↓</span>
            <div className={styles.demoAnswer}>
              <small>LA IA PROPONE</small>
              <p>Imagina una pizza cortada en ocho partes iguales…</p>
              <div><span>1/8</span><span>3/8</span><span>1/2</span></div>
            </div>
          </div>
          <div className={styles.sectionCopy}>
            <p className={styles.handwritten}>ENTIENDE PRIMERO</p>
            <h2>Explica más fácil.</h2>
            <p>
              La IA puede ayudarte a encontrar otra forma de presentar el mismo tema:
              con palabras sencillas, ejemplos cercanos y pasos que puedan seguir juntos.
            </p>
            <ul>
              <li><Check />Adapta el lenguaje a su edad.</li>
              <li><Check />Pide ejemplos relacionados con sus intereses.</li>
              <li><Check />Comprueba la información antes de utilizarla.</li>
            </ul>
            <button className={styles.primaryCta} type="button" onClick={goToRegistration}>
              REGISTRARME GRATIS <span aria-hidden="true">→</span>
            </button>
            <EventReminder />
          </div>
        </div>
      </section>

      <section className={styles.methodSection} id="metodo">
        <div className={styles.shell}>
          <div className={`${styles.centerHeading} ${styles.reveal}`}>
            <p className={styles.handwritten}>UNA RUTA SENCILLA PARA COMENZAR</p>
            <h2>Pregunta. Adapta. Acompaña.</h2>
          </div>
          <div className={`${styles.stepsGrid} ${styles.staggerGrid}`}>
            {steps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <div><small>{step.eyebrow}</small><h3>{step.title}</h3><p>{step.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.instructorSection} id="instructora">
        <div className={`${styles.shell} ${styles.instructorGrid}`}>
          <div className={`${styles.instructorVisual} ${styles.reveal}`}>
            <span className={styles.instructorDisc} aria-hidden="true" />
            <Image
              src="/landings/tareas-con-ia/instructora.webp"
              alt="Miranda Medina, instructora de EBIA"
              width={1024}
              height={1535}
              sizes="(max-width: 760px) 86vw, 470px"
            />
            <p><span>CLASE GUIADA POR</span><strong>MIRANDA<br />MEDINA</strong></p>
          </div>
          <div className={`${styles.instructorCopy} ${styles.reveal}`}>
            <p className={styles.handwritten}>TU GUÍA EN ESTA CLASE</p>
            <h2>Aprende con una instructora real, paso a paso.</h2>
            <p>
              Miranda te mostrará una forma práctica y responsable de incorporar la
              Inteligencia Artificial en la hora de la tarea, incluso si nunca has
              utilizado estas herramientas.
            </p>
            <div className={styles.instructorTags}>
              <span>Instructora EBIA</span>
              <span>Explicaciones claras</span>
              <span>Ejemplos prácticos</span>
            </div>
            <button className={styles.primaryCta} type="button" onClick={goToRegistration}>
              REGISTRARME GRATIS <span aria-hidden="true">→</span>
            </button>
            <EventReminder />
          </div>
        </div>
      </section>

      <section className={styles.registrationSection} id="registro-tareas">
        <div className={styles.registrationDecor} aria-hidden="true"><span>?</span><span>✦</span><span>+ ÷</span></div>
        <div className={`${styles.shell} ${styles.registrationGrid} ${styles.reveal}`}>
          <div>
            <p className={styles.handwritten}>ANTES DE QUE LLEGUE LA SIGUIENTE TAREA</p>
            <h2>La próxima tarea llegará. Esta vez sabrás cómo ayudar.</h2>
            <p>Deja de improvisar entre búsquedas, respuestas confusas y frustración. Aprende un método claro para acompañarlos con IA.</p>
            <EventReminder />
            <ul>
              <li><Check />Clase en línea</li>
              <li><Check />Sin experiencia previa</li>
              <li><Check />Enfoque práctico para familias</li>
            </ul>
          </div>
          <aside className={styles.registrationCard} aria-label="Formulario de registro gratuito">
            <dl>
              <div><dt>Fecha</dt><dd>29 de octubre de 2026</dd></div>
              <div><dt>Horario</dt><dd>12:00 p. m. CDMX</dd></div>
              <div><dt>Modalidad</dt><dd>En línea</dd></div>
            </dl>
            <div className="_form_365" />
            <Script
              id="active-campaign-form-365"
              src="https://cefincapacitacion.activehosted.com/f/embed.php?id=365"
              strategy="afterInteractive"
              charSet="utf-8"
            />
          </aside>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div><p className={styles.handwritten}>ANTES DE COMENZAR</p><h2>Preguntas frecuentes</h2></div>
          <div>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}><Brand inverse /><p>La IA apoya. Tú acompañas.</p><small>© 2026 EBIA. Todos los derechos reservados.</small></div>
      </footer>

      <button className={styles.mobileCta} type="button" onClick={goToRegistration}>
        REGISTRARME GRATIS <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
