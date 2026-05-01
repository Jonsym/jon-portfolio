"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import Breadcrumb from "@/src/components/Breadcrumb";

const WHATSAPP_NUMBER = "529211735484";
const WHATSAPP_DISPLAY = "+52 921 173 5484";
const EMAIL = "jon@jonzamudio.com";

function buildWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function formatMessage({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}) {
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

  const fieldCls =
    "w-full bg-transparent border-0 border-b border-black focus:border-black focus:outline-none py-3 text-base lg:text-lg text-black placeholder-zinc-400 transition-colors";

  const labelCls = "text-xs uppercase tracking-[0.18em] text-zinc-500";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = buildWhatsAppUrl(formatMessage({ name, subject, message }));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Contacto" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <p className={labelCls}>00 / Contacto</p>
        <h1 className="mt-6 font-bold tracking-tighter leading-[0.9] text-black text-5xl md:text-7xl lg:text-8xl">
          Construyamos algo juntos.
        </h1>
        <p className="mt-8 max-w-2xl text-base lg:text-lg leading-relaxed text-zinc-700">
          Cuéntame un poco sobre el proyecto. El formulario envía directo a
          WhatsApp — sin bandejas de entrada de por medio. Suelo responder en
          menos de un día hábil.
        </p>
      </header>

      <div className="mt-20 lg:mt-32 grid grid-cols-12 gap-y-16 lg:gap-x-12">
        <section
          aria-label="Formulario de contacto"
          className="col-span-12 lg:col-span-7 lg:pr-12"
        >
          <h2 className={labelCls}>Formulario</h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-8 max-w-2xl"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={labelCls}>Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className={fieldCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className={labelCls}>Asunto</label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="¿De qué se trata?"
                className={fieldCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={labelCls}>Mensaje</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Alcance del proyecto, tiempos, referencias…"
                className={`${fieldCls} resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-black px-6 py-3 text-sm text-white hover:opacity-80 transition-opacity duration-150"
              >
                <span>Enviar por WhatsApp</span>
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>

              <a
                href={buildWhatsAppUrl(
                  "Hola JonZS — Me gustaría comenzar una conversación sobre un proyecto."
                )}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150 underline-offset-4 hover:underline"
              >
                <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>Enviar por WhatsApp directamente</span>
              </a>
            </div>
          </form>
        </section>

        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-12 lg:border-l lg:border-black/10 lg:pl-12">
          <section>
            <h2 className={labelCls}>Directo</h2>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-xs tabular-nums text-zinc-400">01</span>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-base lg:text-lg text-black hover:opacity-60 transition-opacity duration-150"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-xs tabular-nums text-zinc-400">02</span>
                <a
                  href={buildWhatsAppUrl("Hola JonZS")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base lg:text-lg text-black hover:opacity-60 transition-opacity duration-150 tabular-nums"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className={labelCls}>Horario</h2>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10 text-base lg:text-lg text-black">
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span>Lun — Vie</span>
                <span className="tabular-nums text-zinc-500">09:00 — 18:00</span>
              </li>
              <li className="flex items-baseline justify-between gap-6 py-4">
                <span>Zona horaria</span>
                <span className="text-zinc-500">CST (Ciudad de México)</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <footer className="mt-24 lg:mt-32 pt-8 border-t border-black/10 flex flex-wrap items-center justify-end gap-4">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150"
        >
          <span>Acerca</span>
          <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  );
}
