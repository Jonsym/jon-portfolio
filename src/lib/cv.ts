/**
 * The CV PDFs. Offered on the About page (below Servicios / Stack Tecnológico)
 * rather than the navbar — it's a document about the person, so it belongs with
 * the rest of that story.
 */
export const CV_ES = "/cv/Jonathan-Zamudio-CV-ES.pdf";
export const CV_EN = "/cv/Jonathan-Zamudio-CV-EN.pdf";

export const cvDocs = [
  { code: "ES", href: CV_ES, es: "Español", en: "Spanish" },
  { code: "EN", href: CV_EN, es: "Inglés", en: "English" },
] as const;
