"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import Breadcrumb from "@/src/components/Breadcrumb";
import { T, useLocale, useTPair } from "@/src/components/I18nProvider";

const WHATSAPP_NUMBER = "529211735484";
const WHATSAPP_DISPLAY = "+52 921 173 5484";
const EMAIL = "jon@jonzamudio.com";

function buildWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function formatMessage(
  locale: "es" | "en",
  { name, subject, message }: { name: string; subject: string; message: string },
) {
  if (locale === "en") {
    return [
      `Hi JonZS — I'm ${name || "[name]"}.`,
      "",
      `Subject: ${subject || "[subject]"}`,
      "",
      message || "[message]",
    ].join("\n");
  }
  return [
    `Hola JonZS — Soy ${name || "[nombre]"}.`,
    "",
    `Asunto: ${subject || "[asunto]"}`,
    "",
    message || "[mensaje]",
  ].join("\n");
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const locale = useLocale();

  const placeholderName = useTPair("Tu nombre completo", "Your full name");
  const placeholderSubject = useTPair("¿De qué se trata?", "What is it about?");
  const placeholderMessage = useTPair(
    "Alcance del proyecto, tiempos, referencias…",
    "Project scope, timeline, references…",
  );
  const ariaForm = useTPair("Formulario de contacto", "Contact form");

  const fieldCls =
    "w-full bg-transparent border-0 border-b border-line-strong focus:border-foreground-strong focus:outline-none py-3 text-base lg:text-lg text-foreground placeholder-muted transition-colors";

  const labelCls = "text-xs uppercase tracking-[0.2em] text-muted";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = buildWhatsAppUrl(
      formatMessage(locale, { name, subject, message }),
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const directGreeting =
    locale === "en"
      ? "Hi JonZS — I'd like to start a conversation about a project."
      : "Hola JonZS — Me gustaría comenzar una conversación sobre un proyecto.";

  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { es: "Inicio", en: "Home", href: "/" },
          { es: "Contacto", en: "Contact" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <h1 className="mt-6 font-semibold tracking-tighter leading-[0.9] text-foreground text-5xl md:text-7xl lg:text-8xl">
          <T
            es="Construyamos algo juntos."
            en="Let's build something together."
          />
        </h1>
        <p className="mt-8 max-w-2xl text-base lg:text-lg leading-relaxed text-muted-strong">
          <T
            es="Cuéntame un poco sobre el proyecto. El formulario envía directo a WhatsApp — sin bandejas de entrada de por medio. Suelo responder en menos de un día hábil."
            en="Tell me a bit about the project. The form sends straight to WhatsApp — no inboxes in between. I usually reply within one business day."
          />
        </p>
      </header>

      <div className="mt-20 lg:mt-32 grid grid-cols-12 gap-y-16 lg:gap-x-12">
        <section
          aria-label={ariaForm}
          className="col-span-12 lg:col-span-7 lg:pr-12"
        >
          <h2 className={labelCls}>
            <T es="Formulario" en="Form" />
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-8 max-w-2xl"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={labelCls}>
                <T es="Nombre" en="Name" />
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholderName}
                className={fieldCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className={labelCls}>
                <T es="Asunto" en="Subject" />
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={placeholderSubject}
                className={fieldCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={labelCls}>
                <T es="Mensaje" en="Message" />
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholderMessage}
                className={`${fieldCls} resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-foreground-strong px-6 py-3 text-sm text-background hover:opacity-80 transition-opacity duration-150"
              >
                <span>
                  <T es="Enviar por WhatsApp" en="Send via WhatsApp" />
                </span>
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>

              <a
                href={buildWhatsAppUrl(directGreeting)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60 transition-opacity duration-150 underline-offset-4 hover:underline"
              >
                <MessageCircle
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>
                  <T
                    es="Enviar por WhatsApp directamente"
                    en="Send via WhatsApp directly"
                  />
                </span>
              </a>
            </div>
          </form>
        </section>

        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-12 lg:border-l lg:border-line lg:pl-12">
          <section>
            <h2 className={labelCls}>
              <T es="Directo" en="Direct" />
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-xs tabular-nums text-muted">01</span>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-base lg:text-lg text-foreground hover:opacity-60 transition-opacity duration-150"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-xs tabular-nums text-muted">02</span>
                <a
                  href={buildWhatsAppUrl(
                    locale === "en" ? "Hi JonZS" : "Hola JonZS",
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base lg:text-lg text-foreground hover:opacity-60 transition-opacity duration-150 tabular-nums"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className={labelCls}>
              <T es="Horario" en="Hours" />
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line text-base lg:text-lg text-foreground">
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span>
                  <T es="Lun — Vie" en="Mon — Fri" />
                </span>
                <span className="tabular-nums text-muted">
                  09:00 — 18:00
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span>
                  <T es="Zona horaria" en="Time zone" />
                </span>
                <span className="text-muted">
                  <T
                    es="CST (Ciudad de México)"
                    en="CST (Mexico City)"
                  />
                </span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <footer className="mt-24 lg:mt-32 pt-8 border-t border-line flex flex-wrap items-center justify-end gap-4">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60 transition-opacity duration-150"
        >
          <span>
            <T es="Acerca" en="About" />
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  );
}
