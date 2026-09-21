"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Brand } from "@/app/components/Brand";
import { buildTeacherCheckoutUrl, getTeacherCheckoutBaseUrl } from "@/lib/checkout";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import styles from "./page.module.css";

const campaign = "ia-maestros-inscripcion";
const productName = "Inteligencia Artificial para Maestros: De Cero al Aula";
const eventDate = "29 y 30 de septiembre · 1 de octubre";
const eventTime = "6:00 PM · Hora CDMX";

const audience = [
  "Quieres comenzar a usar IA, pero no sabes por dónde empezar.",
  "Buscas ideas para actividades y materiales de clase.",
  "Quieres explicar temas con mayor claridad.",
  "Necesitas ahorrar tiempo sin delegar tu criterio docente.",
];

const included = [
  "3 clases prácticas en vivo",
  "Cuaderno de trabajo",
  "Banco de prompts descargable",
  "Grabaciones",
  "Acompañamiento durante el proceso",
  "Constancia al finalizar",
];

const faqs = [
  {
    question: "¿Necesito experiencia previa con inteligencia artificial?",
    answer: "No. De Cero al Aula está pensado para maestros que quieren comenzar con una ruta clara y práctica.",
  },
  {
    question: "¿Cuál es el precio?",
    answer: "La inversión es de $297.00 MXN.",
  },
  {
    question: "¿Cómo se desarrolla?",
    answer: "Son 3 clases prácticas en vivo los días 29 y 30 de septiembre y 1 de octubre, a las 6:00 PM, hora CDMX.",
  },
  {
    question: "¿Qué incluye mi compra?",
    answer: "Incluye las 3 clases en vivo, cuaderno de trabajo, banco de prompts descargable, grabaciones, acompañamiento durante el proceso y constancia al finalizar.",
  },
  {
    question: "¿Cómo se realiza el pago?",
    answer: "La compra se procesa de forma segura a través de Hotmart.",
  },
  {
    question: "¿Qué sucede después de pagar?",
    answer: "Hotmart confirmará tu compra y te mostrará la información disponible para continuar con el acceso al producto.",
  },
];

export function TeacherSalesPage() {
  const fallbackCheckout = getTeacherCheckoutBaseUrl()?.toString() ?? "#compra";
  const [checkout, setCheckout] = useState<string | null>(fallbackCheckout);

  useEffect(() => {
    setCheckout(buildTeacherCheckoutUrl(window.location.search));
    return trackMetaEventWhenReady(
      "ViewContent",
      campaign,
      {
        content_name: productName,
        content_category: "Formación para docentes",
        value: 297,
        currency: "MXN",
      },
      "session",
    );
  }, []);

  const buy = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!checkout) {
      event.preventDefault();
      document.getElementById("checkout-status")?.focus();
      return;
    }
    trackMetaEventWhenReady(
      "InitiateCheckout",
      campaign,
      {
        content_name: productName,
        value: 297,
        currency: "MXN",
      },
      "none",
    );
  };

  const href = checkout ?? "#compra";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <Brand />
          <div className={styles.headerActions}>
            <span>EDUCACIÓN + IA</span>
            <a href={href} onClick={buy}>INSCRÍBEME AHORA</a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>3 CLASES PRÁCTICAS EN VIVO PARA DOCENTES</p>
            <h1>
              Inteligencia Artificial para Maestros:
              <strong>De Cero al Aula</strong>
            </h1>
            <p className={styles.lead}>
              Aprende a utilizar la Inteligencia Artificial para preparar tus clases
              de manera práctica, sencilla y eficiente.
            </p>
            <p className={styles.leadSecondary}>
              Descubre cómo crear mejores contenidos, optimizar tu tiempo y dejar de
              comenzar cada clase desde cero.
            </p>
            <div className={styles.chips}>
              <span>3 clases prácticas en vivo</span>
              <span>Sin experiencia previa</span>
              <span>Enfoque docente</span>
            </div>
            <dl className={styles.eventFacts} aria-label="Fechas y horario del curso">
              <div><dt>FECHAS</dt><dd>{eventDate}</dd></div>
              <div><dt>HORARIO</dt><dd>{eventTime}</dd></div>
            </dl>
            <div className={styles.purchaseRow}>
              <div>
                <small>INVERSIÓN</small>
                <strong>$297.00 <span>MXN</span></strong>
              </div>
              <a className={styles.primaryCta} href={href} onClick={buy}>
                INSCRÍBEME AHORA <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className={styles.secureNote}>Pago seguro procesado por Hotmart.</p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.board} aria-hidden="true">
              IA + AULA
            </div>
            <Image
              src="/landings/media/ia-desde-cero/Foto2.png"
              alt="Instructora de EBIA para Inteligencia Artificial para Maestros"
              width={1067}
              height={1600}
              priority
              sizes="(max-width: 767px) 92vw, 44vw"
            />
            <div className={`${styles.note} ${styles.noteOne}`}>Ideas para enseñar</div>
            <div className={`${styles.note} ${styles.noteTwo}`}>Tu criterio decide</div>
          </div>
        </div>
      </section>

      <section className={styles.trustStrip} aria-label="Características de la oferta">
        <div className={styles.shell}>
          <div><small>CREADO PARA</small><strong>Maestros</strong></div>
          <div><small>NIVEL</small><strong>Desde cero</strong></div>
          <div><small>FECHAS</small><strong>29, 30 SEP · 1 OCT</strong></div>
          <div><small>INVERSIÓN</small><strong>$297.00 MXN</strong></div>
        </div>
      </section>

      <section className={styles.audienceSection}>
        <div className={styles.shell}>
          <div className={styles.sectionIntro}>
            <p>UNA RUTA PENSADA PARA TI</p>
            <h2>La IA puede ayudarte sin quitarte el control de tu clase.</h2>
          </div>
          <div className={styles.audienceGrid}>
            {audience.map((item, index) => (
              <article key={item}>
                <span>0{index + 1}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
          <div className={styles.quickCta}>
            <p>29 y 30 de septiembre · 1 de octubre · 6:00 PM</p>
            <a className={styles.primaryCta} href={href} onClick={buy}>
              INSCRÍBEME AHORA <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.gameSection}>
        <div className={`${styles.shell} ${styles.gameGrid}`}>
          <div>
            <p>APRENDER TAMBIÉN PUEDE SER JUGAR</p>
            <h2>Aprende a crear videojuegos didácticos con Inteligencia Artificial.</h2>
            <p className={styles.gameLead}>Convierte ideas en actividades interactivas que puedas llevar a tus clases y adaptar a tus alumnos.</p>
          </div>
          <div className={styles.gameAction}>
            <div className={styles.gameBenefits}>
              <article><span>01</span><strong>Motiva a tus alumnos</strong></article>
              <article><span>02</span><strong>Facilita tu planeación</strong></article>
              <article><span>03</span><strong>Ahorra tiempo</strong></article>
              <article><span>04</span><strong>Crea clases increíbles</strong></article>
            </div>
            <a className={styles.gameCta} href={href} onClick={buy}>
              INSCRÍBEME AHORA <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.offerSection} id="compra">
        <div className={`${styles.shell} ${styles.offerGrid}`}>
          <div className={styles.offerCopy}>
            <p>INTELIGENCIA ARTIFICIAL PARA MAESTROS</p>
            <h2>Da el paso de cero al aula.</h2>
            <p>Tres clases prácticas en vivo para ayudarte a preparar clases, crear mejores contenidos y optimizar tu tiempo con IA.</p>
            <div className={styles.offerSchedule}>
              <div><small>FECHAS</small><strong>{eventDate}</strong></div>
              <div><small>HORARIO</small><strong>{eventTime}</strong></div>
            </div>
            <ul>{included.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
          </div>
          <aside className={styles.priceCard} aria-label="Oferta de compra">
            <span className={styles.tape} aria-hidden="true" />
            <p>PAGO ÚNICO</p>
            <h3>{productName}</h3>
            <div className={styles.price}><small>$</small>297.00 <span>MXN</span></div>
            <a className={styles.primaryCta} href={href} onClick={buy}>
              INSCRÍBEME AHORA <span aria-hidden="true">→</span>
            </a>
            <small className={styles.hotmartNote}>Compra procesada de forma segura por Hotmart.</small>
            {!checkout && (
              <p id="checkout-status" tabIndex={-1} className={styles.checkoutWarning}>
                No fue posible preparar el checkout. Inténtalo nuevamente en unos minutos.
              </p>
            )}
          </aside>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div>
            <p>PREGUNTAS FRECUENTES</p>
            <h2>Lo esencial antes de comprar.</h2>
          </div>
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

      <section className={styles.finalCta}>
        <div className={styles.shell}>
          <p>Tu experiencia docente sigue siendo lo más importante.</p>
          <h2>Ahora puedes sumar la IA como una herramienta a tu favor.</h2>
          <div className={styles.finalSchedule}>{eventDate}<br />{eventTime}</div>
          <div className={styles.finalPrice}>$297.00 <span>MXN</span></div>
          <a className={styles.primaryCta} href={href} onClick={buy}>
            INSCRÍBEME AHORA <span aria-hidden="true">→</span>
          </a>
          <small>Pago seguro procesado por Hotmart.</small>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Brand />
          <p>Escuela Básica de Inteligencia Artificial</p>
          <small>© 2026 EBIA. Todos los derechos reservados.</small>
        </div>
      </footer>

      <div className={styles.mobilePurchaseBar}>
        <div><small>PAGO ÚNICO</small><strong>$297.00 MXN</strong></div>
        <a href={href} onClick={buy}>INSCRÍBEME AHORA</a>
      </div>
    </main>
  );
}
